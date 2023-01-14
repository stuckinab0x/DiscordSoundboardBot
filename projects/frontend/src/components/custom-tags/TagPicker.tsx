import React, { FC, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { KeyedMutator } from 'swr';
import CustomTag from '../../models/custom-tag';
import TagToolbar from './TagToolbar';
import TagTileContainer from './TagTileContainer';

const TagPickerMain = styled.div`
  display: flex;
  flex-wrap: wrap;
  
  background-color: ${ props => props.theme.colors.innerA };
  border: 5px solid ${ props => props.theme.colors.borderDefault };
  border-radius: 5px;
  box-shadow: 0px 2px 5px 2px ${ props => props.theme.colors.shadowDefault };

  height: max-content;
  margin: 10px 50px 0px;

  @media only screen and (max-width: 780px) {
    margin: 10px 10px 0px;
    border: 3px solid ${ props => props.theme.colors.borderDefault };
    border-radius: 3px;
  }
`;

const ColumnDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

interface TagPickerProps {
  customTags: CustomTag[];
  setDisableEditTagsButton: (disable: boolean) => void;
  beginTagging: (tagId: string) => void;
  mutateTags: KeyedMutator<CustomTag[]>
}

const TagPicker: FC<TagPickerProps> = ({ customTags, setDisableEditTagsButton, beginTagging, mutateTags }) => {
  const [editMode, setEditMode] = useState(false);
  const [currentlyEditing, setCurrentlyEditing] = useState<CustomTag | null>(null);
  const [newTagProps, setNewTagProps] = useState({ name: '', color: '' });
  const handleEditTagClick = useCallback((id: string) => {
    const tag = customTags.find(x => (x.id === id));
    if (tag) {
      setCurrentlyEditing(tag);
      setEditMode(true);
    }
  }, [customTags]);

  useEffect(() => {
    if (editMode) setDisableEditTagsButton(true);
    else setDisableEditTagsButton(false);
  });

  return (
    <TagPickerMain>
      <ColumnDiv>
        <TagToolbar
          editMode={ editMode }
          setEditMode={ setEditMode }
          customTags={ customTags }
          currentlyEditing={ currentlyEditing }
          setCurrentlyEditing={ setCurrentlyEditing }
          setNewTagProps={ setNewTagProps }
          mutateTags={ mutateTags }
        />
        <TagTileContainer
          customTags={ customTags }
          editMode={ editMode }
          currentlyEditing={ currentlyEditing }
          setEditMode={ setEditMode }
          newTagProps={ newTagProps }
          handleEditTagClick={ handleEditTagClick }
          beginTagging={ beginTagging }
        />
      </ColumnDiv>
    </TagPickerMain>
  );
};

export default TagPicker;
