import { FC } from 'react';
import styled from 'styled-components';
import TagTile from './TagTile';
import CustomTag from '../../models/custom-tag';
import { button, tagButtonTemplate, textShadowVisibility } from '../../styles/mixins';

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media only screen and (max-width: ${ props => props.theme.params.widthSelector3 }px) {
    flex-direction: column;
    flex-wrap: nowrap;
  }
`;

const NewTagButton = styled.button`
  ${ tagButtonTemplate }
  ${ button }
`;

const DisabledNewTag = styled.button`
  ${ tagButtonTemplate }
  border-color: ${ props => props.theme.colors.accent };
  background-color: ${ props => props.color || '' };
  opacity: 0.6;
`;

interface EmptyNewTagProps {
  color: string;
}

const EmptyNewTag = styled.button<EmptyNewTagProps>`
  ${ tagButtonTemplate }
  ${ textShadowVisibility }
  border-style: dashed;
  word-wrap: break-word;
  background-color: ${ props => props.color };
`;

interface TagTileContainerProps {
  customTags: CustomTag[];
  editMode: boolean;
  creatingNew: boolean;
  beginCreatingNew: () => void;
  currentId: string | undefined;
  currentName: string | undefined;
  currentColor: string | undefined;
  handleEditTagClick: (id: string) => void;
}

const TagTileContainer: FC<TagTileContainerProps> = ({ customTags, editMode, creatingNew, beginCreatingNew, currentId, currentName, currentColor, handleEditTagClick }) => (
  <TagsContainer>
    { editMode ? <DisabledNewTag>New</DisabledNewTag> : (
      <NewTagButton onClick={ beginCreatingNew }>
        New
      </NewTagButton>
    ) }
    { customTags.map(tag => (
      <TagTile
        key={ tag.id }
        id={ tag.id }
        name={ currentId === tag.id ? currentName : tag.name }
        color={ currentId === tag.id ? currentColor : tag.color }
        editMode={ editMode }
        handleEditTagClick={ handleEditTagClick }
      />
    )) }
    { (editMode && creatingNew) && <EmptyNewTag color={ currentColor || '' } disabled>{ currentName || '???' }</EmptyNewTag> }
  </TagsContainer>
);

export default TagTileContainer;
