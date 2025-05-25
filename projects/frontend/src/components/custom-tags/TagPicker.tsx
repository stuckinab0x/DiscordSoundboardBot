import { FC, useState, useCallback } from 'react';
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
  border-radius: 2px;
  box-shadow: 0 0 2px 0 ${ props => props.theme.colors.shadowDefault };

  height: max-content;
  margin: 2px 0 0px;
  padding: 10px 50px;

  @media only screen and (max-width: 780px) {
    margin: 10px 10px 0px;
    border: 3px solid ${ props => props.theme.colors.accent };
    border-radius: 3px;
  }
`;

const ColumnDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const TagPicker: FC = () => {
  const { data: customTags, mutate } = useSWR<CustomTag[]>('/api/tags');

  const { editingTag, setEditingTag } = useCustomTags();

  const [currentlyEditing, setCurrentlyEditing] = useState<CustomTag | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);

  const handleEditTagClick = useCallback((id: string) => {
    const tag = customTags?.find(x => (x.id === id));
    if (tag) {
      setCurrentlyEditing({ ...tag });
      setEditingTag(true);
    }
  }, [customTags]);

  const beginCreatingNew = useCallback(() => {
    setEditingTag(true);
    setCreatingNew(true);
    setCurrentlyEditing({ id: '', name: '', color: '', sounds: [] });
  }, []);

  return (
    <TagPickerMain>
      <ColumnDiv>
        <TagToolbar
          editMode={ editingTag }
          setEditMode={ setEditingTag }
          customTags={ customTags ?? [] }
          currentlyEditing={ currentlyEditing }
          setCurrentlyEditing={ setCurrentlyEditing }
          creatingNew={ creatingNew }
          cancelCreatingNew={ () => setCreatingNew(false) }
          mutateTags={ mutate }
        />
        <TagTileContainer
          customTags={ customTags ?? [] }
          editMode={ editingTag }
          creatingNew={ creatingNew }
          beginCreatingNew={ beginCreatingNew }
          currentName={ currentlyEditing?.name }
          currentColor={ currentlyEditing?.color }
          handleEditTagClick={ handleEditTagClick }
        />
      </ColumnDiv>
    </TagPickerMain>
  );
};

export default TagPicker;
