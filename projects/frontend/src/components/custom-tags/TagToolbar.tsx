import React, { FC, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { KeyedMutator } from 'swr';
import * as mixins from '../../styles/mixins';
import CustomTag from '../../models/custom-tag';
import TagColorPicker from './TagColorPicker';
import { useCustomTags } from '../../contexts/custom-tags-context';

const ToolbarMain = styled.div`
  display: flex;
  align-items: center;
  
  color: ${ props => props.theme.colors.borderDefault };
  margin: 3px;
  border-bottom: 4px solid ${ props => props.theme.colors.borderDefault };
  border-radius: 4px;
  height: fit-content;
  padding-left: 20px;

  @media only screen and (max-width: 780px) {
    justify-content: center;
    padding: 2px 6px
  }
`;

const Dialog = styled.p`
  text-shadow: 2px 2px 3px ${ props => props.theme.colors.shadowDefault };
  font-weight: bold;

  @media only screen and (max-width: 780px) {

  }
`;

const CloseBar = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  margin: 0px 20px;
  flex-grow: 1;
  opacity: 0.5;
  background-color: ${ props => props.theme.colors.borderRed };
  border-radius: 8px;
  padding: 5px 0px;
  cursor: pointer;
  box-shadow: 0px 3px 4px ${ props => props.theme.colors.shadowDefault };

  &:hover {
    opacity: 0.7;
  }

  > p {
    display: flex;
    align-items: center;
    color: black;
    font-weight: bold;
    opacity: 0.8;
    margin: 0;
  }

  @media only screen and (max-width: 780px) {
    height: 20px;
    margin: 0px 8px;
  }
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  border-left: 4px solid ${ props => props.theme.colors.borderDefault };
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
  margin-left: 12px;
  
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

  margin-left: 10px;
`;

const DisabledButton = styled.button`
  ${ mixins.filterButton }

  margin-left: 10px;
  opacity: 0.5;
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
  margin-left: 10px;
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
  setCurrentlyEditing: (tag: CustomTag | null) => void;
  setNewTagProps: (props: { name: string; color: string }) => void;
  mutateTags: KeyedMutator<CustomTag[]>
}

const TagToolbar: FC<TagToolbarProps> = ({ editMode, setEditMode, customTags, currentlyEditing, setCurrentlyEditing, setNewTagProps, mutateTags }) => {
  const [nameInput, setNameInput] = useState('');
  const [tagColor, setTagColor] = useState('');
  const [disableSaveButton, setDisableSaveButton] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const selectColor = useCallback((color: string) => {
    setTagColor(color);
    setShowColorPicker(false);
  }, []);

  const { toggleShowCustomTagPicker } = useCustomTags();

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (currentlyEditing) {
      setNameInput(currentlyEditing.name);
      setTagColor(currentlyEditing.color);
      setDisableSaveButton(false);
    }
  }, [currentlyEditing, editMode]);

  useEffect(() => {
    setDisableSaveButton(!nameInput || !tagColor);
    setNewTagProps({ name: nameInput, color: tagColor });
  }, [nameInput, tagColor]);

  const resetToolbar = useCallback(() => {
    setNameInput('');
    setTagColor('');
    setDisableSaveButton(true);
    setShowColorPicker(false);
    setEditMode(false);
    setCurrentlyEditing(null);
    setShowConfirmDelete(false);
  }, []);

  const addOrEditTagRequest = useCallback(async () => {
    let tag: CustomTag = { id: '', name: nameInput, color: tagColor, sounds: [] };
    let method = 'POST';
    let newTags = [...customTags];
    if (customTags && currentlyEditing) {
      const foundTag = customTags.find(x => x.id === currentlyEditing.id);
      if (foundTag) tag = foundTag;
      method = 'PUT';
      newTags[newTags.findIndex(x => x.id === tag.id)] = { ...(tag), name: nameInput, color: tagColor };
    } else if (customTags) {
      tag.id = 'arealtag';
      newTags = [...newTags, tag];
    }
    const tagRequest = async () => {
      await fetch(
        `/api/tags/${ method === 'PUT' ? `${ tag.id }` : '' }`,
        {
          method,
          body: JSON.stringify({ name: nameInput, color: tagColor }),
          headers: { 'Content-Type': 'application/json' },
        },
      );
      return newTags;
    };
    mutateTags(tagRequest(), { optimisticData: newTags, rollbackOnError: true });
    resetToolbar();
  }, [nameInput, customTags, currentlyEditing, tagColor]);

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
          <input type='text' value={ nameInput } onChange={ event => setNameInput(event.currentTarget.value) } />
        </NameField>
        <ColorButton color={ tagColor } onClick={ () => setShowColorPicker(!showColorPicker) }>
          { showColorPicker && <TagColorPicker selectColor={ selectColor } /> }
        </ColorButton>
        { disableSaveButton ? <DisabledButton>Save</DisabledButton> : (
          <ToolbarButton onClick={ addOrEditTagRequest }>
            Save
          </ToolbarButton>
        ) }
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
