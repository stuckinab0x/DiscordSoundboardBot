import React, { FC, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import CustomTag from '../../models/custom-tag';
import TagToolbar from './TagToolbar';
import TagTileContainer from './TagTileContainer';
import { useCustomTags } from '../../contexts/custom-tags-context';

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

const TagPicker: FC = () => {
  const { data: customTags, mutate } = useSWR<CustomTag[]>('/api/customtags');

  const [editMode, setEditMode] = useState(false);
  const [currentlyEditing, setCurrentlyEditing] = useState<CustomTag | null>(null);
  const [newTagProps, setNewTagProps] = useState({ name: '', color: '' });
  const { setDisableEditTagsButton } = useCustomTags();

  const handleEditTagClick = useCallback((id: string) => {
    const tag = customTags?.find(x => (x.id === id));
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
          customTags={ customTags ?? [] }
          currentlyEditing={ currentlyEditing }
          setCurrentlyEditing={ setCurrentlyEditing }
          setNewTagProps={ setNewTagProps }
          mutateTags={ mutate }
        />
        <TagTileContainer
          customTags={ customTags ?? [] }
          editMode={ editMode }
          currentlyEditing={ currentlyEditing }
          setEditMode={ setEditMode }
          newTagProps={ newTagProps }
          handleEditTagClick={ handleEditTagClick }
        />
      </ColumnDiv>
    </TagPickerMain>
  );
};

export default TagPicker;
