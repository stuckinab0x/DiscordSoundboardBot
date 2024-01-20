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
  
  color: ${ props => props.theme.colors.accent };
  margin: 3px;
  border-bottom: 4px solid ${ props => props.theme.colors.accent };
  border-radius: 4px;
  height: fit-content;
  padding-left: 20px;

  > ${ CloseBar } {
    margin: 0px 10px;
  }

  @media only screen and (max-width: 780px) {
    justify-content: center;
    padding: 2px 6px
  }
`;

const Dialog = styled.p`
  text-shadow: 2px 2px 3px ${ props => props.theme.colors.shadowDefault };
  font-weight: bold;
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  border-left: 4px solid ${ props => props.theme.colors.accent };
  margin: 0px 0px 4px 12px;

  @media only screen and (max-width: 780px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const NameField = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0px 5px 0px 12px;
  
  > p {
    font-weight: bold;
    text-shadow: 2px 2px 3px ${ props => props.theme.colors.shadowDefault };
  }

  > input {
    ${ mixins.textInput }
    ${ mixins.textInputMobile }

    margin-left: 10px;
    margin-bottom: 0px;

    @media only screen and (max-width: 780px) {
      margin-left: 10px;
    }
  }

  @media only screen and (max-width: 780px) {
    margin-left: 8px;
  }
`;

const ToolbarButton = styled.button`
  ${ mixins.button }
  ${ mixins.filterButton }
  ${ mixins.filterButtonMobile }

  ${ props => props.disabled && css`
    pointer-events: none;
    opacity: 0.5;
  ` }

  margin: 0px 5px;
`;

const ConfirmDelete = styled(ToolbarButton)`
  border-color: ${ props => props.theme.colors.borderRed };
`;

interface ColorButtonProps {
  color: string;
}

const ColorButton = styled.div<ColorButtonProps>`
  ${ mixins.filterButton }
  ${ mixins.filterButtonMobile }

  min-height: 30px;
  width: 60px;
  cursor: pointer;
  position: relative;
  margin: 0px 5px;
  background-color: ${ props => props.color };
  z-index: 10;

  @media only screen and (max-width: 780px) {
    max-height: 26px;
  }
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
  const [showColorPicker, setShowColorPicker] = useState(false);

  const selectColor = useCallback((newColor: string) => {
    setCurrentlyEditing(oldState => {
      if (!oldState)
        return null;
      return { ...oldState, color: newColor };
    });
    setShowColorPicker(false);
  }, []);

  const { toggleShowCustomTagPicker } = useCustomTags();

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const resetToolbar = useCallback(() => {
    setShowColorPicker(false);
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
      <Dialog>
        { editMode ? 'Edit tag properties' : 'Select a tag to begin tagging or create/edit a tag. ' }
      </Dialog>
      { !editMode && (
        <CloseBar role='presentation' onClick={ toggleShowCustomTagPicker }>
          <p>Close</p>
        </CloseBar>
      ) }
      { editMode && (
      <ToolbarRight>
        <NameField>
          <p>Name:</p>
          <input type='text' value={ currentlyEditing?.name } onChange={ event => handleInputChange(event.target.value) } />
        </NameField>
        <ColorButton color={ currentlyEditing?.color || '' } onClick={ () => setShowColorPicker(!showColorPicker) }>
          { showColorPicker && <TagColorPicker selectColor={ selectColor } /> }
        </ColorButton>
        <ToolbarButton onClick={ addOrEditTagRequest } disabled={ !currentlyEditing?.name || !currentlyEditing.color }>
          Save
        </ToolbarButton>
        <ToolbarButton onClick={ resetToolbar }>
          Discard Changes
        </ToolbarButton>
        { currentlyEditing && (
          <ToolbarButton onClick={ () => setShowConfirmDelete(!showConfirmDelete) }>
            { showConfirmDelete ? 'Cancel Delete' : 'Delete' }
          </ToolbarButton>
        ) }
        { showConfirmDelete && (
          <ConfirmDelete onClick={ () => deleteTagRequest() }>
            Confirm Delete
          </ConfirmDelete>
        ) }
      </ToolbarRight>
      ) }
    </ToolbarMain>
  );
};

export default TagToolbar;
