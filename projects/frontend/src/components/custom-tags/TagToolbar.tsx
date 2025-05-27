import { FC, useState, useCallback, SetStateAction } from 'react';
import styled, { css } from 'styled-components';
import { KeyedMutator } from 'swr';
import * as mixins from '../../styles/mixins';
import CustomTag from '../../models/custom-tag';
import TagColorPicker from './TagColorPicker';
import { useCustomTags } from '../../contexts/custom-tags-context';
import { CloseBar } from '../../styles/components';

const ToolbarMain = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  min-height: 42px;

  > ${ CloseBar } {
    font-size: 18px;
  }
`;

const EditingBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    display: flex;
    align-items: center;
    margin: 3px 0;
  }

  @media only screen and (max-width: ${ props => props.theme.params.widthSelector1 }px) {
    flex-direction: column;
    width: 100%;

    > div {
      width: 100%;
      justify-content: center;
    }
  }
`;

const NameField = styled.div`
  display: flex;
  align-items: center;
  margin: 0 5px 0 0;

  > input {
    ${ mixins.textInput }
    min-height: 42px;
    padding: 0 2px;
  }

  @media only screen and (max-width: ${ props => props.theme.params.widthSelector1 }px) {
    width: 100%;
    margin: 0;
  }
`;

const ToolbarButton = styled.button`
  ${ mixins.button }
  ${ mixins.filterButton }
  ${ mixins.filterButtonMobile }

  font-size: 18.6px;

  ${ props => props.disabled && css`
    pointer-events: none;
    opacity: 0.5;
  ` }

  margin: 0 5px;

  &:first-of-type {
    background-color: ${ props => props.theme.colors.borderGreen };
    text-shadow: 0 0 4px ${ props => props.theme.colors.shadowDefault };
  }

  &:last-of-type {
    background-color: ${ props => props.theme.colors.borderRed };
    text-shadow: 0 0 4px ${ props => props.theme.colors.shadowDefault };
  }

  @media only screen and (max-width: ${ props => props.theme.params.widthSelector2 }px) {
    min-height: 42px;
  }
`;

const ConfirmDelete = styled(ToolbarButton)`
  border-color: ${ props => props.theme.colors.borderRed };
`;

interface TagToolbarProps {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  customTags: CustomTag[];
  currentlyEditing: CustomTag | null;
  setCurrentlyEditing: React.Dispatch<SetStateAction<CustomTag | null>>;
  creatingNew: boolean;
  cancelCreatingNew: () => void;
  mutateTags: KeyedMutator<CustomTag[]>
}

const TagToolbar: FC<TagToolbarProps> = ({ editMode, setEditMode, customTags, currentlyEditing, setCurrentlyEditing, creatingNew, cancelCreatingNew, mutateTags }) => {
  const selectColor = useCallback((newColor: string) => {
    setCurrentlyEditing(oldState => {
      if (!oldState)
        return null;
      return { ...oldState, color: newColor };
    });
  }, []);

  const { toggleShowCustomTagPicker } = useCustomTags();

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const resetToolbar = useCallback(() => {
    setEditMode(false);
    setCurrentlyEditing(null);
    cancelCreatingNew();
    setShowConfirmDelete(false);
  }, []);

  const handleInputChange = useCallback((newValue: string) => {
    setCurrentlyEditing(oldState => {
      if (!oldState)
        return null;
      return ({ ...oldState, name: newValue });
    });
  }, []);

  const addOrEditTagRequest = useCallback(async () => {
    if (!currentlyEditing || !customTags)
      return;
    const tag: CustomTag = { ...currentlyEditing };
    let method = 'POST';
    let newTags: CustomTag[] = [...customTags];

    if (!creatingNew) {
      const foundTag = customTags.findIndex(x => x.id === currentlyEditing.id);
      method = 'PUT';
      newTags = newTags.with(foundTag, tag);
    } else {
      newTags.push(tag);
    }
    const tagRequest = async () => {
      await fetch(
        `/api/tags/${ method === 'PUT' ? `${ tag.id }` : '' }`,
        {
          method,
          body: JSON.stringify({ name: currentlyEditing.name, color: currentlyEditing.color }),
          headers: { 'Content-Type': 'application/json' },
        },
      );
      return newTags;
    };
    mutateTags(tagRequest(), { optimisticData: newTags, rollbackOnError: true });
    resetToolbar();
  }, [customTags, currentlyEditing, creatingNew]);

  const deleteTagRequest = useCallback(async () => {
    if (customTags && currentlyEditing) {
      const newTags = customTags.filter(x => x.id !== currentlyEditing.id);
      const deleteTag = async () => {
        await fetch(`/api/tags/${ currentlyEditing.id }`, { method: 'DELETE' });
        return newTags;
      };
      mutateTags(deleteTag(), { optimisticData: newTags, rollbackOnError: true });
      resetToolbar();
    }
  }, [customTags, currentlyEditing]);

  return (
    <ToolbarMain>
      { !editMode && (
        <CloseBar role='presentation' onClick={ toggleShowCustomTagPicker }>
          <p>Close Tag Editor</p>
        </CloseBar>
      ) }
      { editMode && currentlyEditing && (
      <EditingBar>
        <div>
          <NameField>
            <input type='text' value={ currentlyEditing?.name } onChange={ event => handleInputChange(event.target.value) } />
          </NameField>
        </div>
        <div>
          <TagColorPicker currentColor={ currentlyEditing?.color } selectColor={ selectColor } />
        </div>
        <div>
          <ToolbarButton onClick={ addOrEditTagRequest } disabled={ !currentlyEditing?.name || !currentlyEditing.color }>
            Save
          </ToolbarButton>
          <ToolbarButton onClick={ resetToolbar }>
            Discard
          </ToolbarButton>
          { currentlyEditing && !creatingNew && (
          <ToolbarButton onClick={ () => setShowConfirmDelete(!showConfirmDelete) }>
            { showConfirmDelete ? 'Cancel Delete' : 'Delete' }
          </ToolbarButton>
          ) }
          { showConfirmDelete && (
          <ConfirmDelete onClick={ () => deleteTagRequest() }>
            Confirm Delete
          </ConfirmDelete>
          ) }
        </div>
      </EditingBar>
      ) }
    </ToolbarMain>
  );
};

export default TagToolbar;
