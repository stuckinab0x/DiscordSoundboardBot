import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import TagTile from './TagTile';
import CustomTag from '../../models/custom-tag';
import { button, textShadowVisibility } from '../../styles/mixins';

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const tagButtonTemplate = css`
  color: white;
  font-weight: bold;
  background-color: ${ props => props.theme.colors.innerB };
  border: 3px solid ${ props => props.theme.colors.borderDefault };
  border-radius: 3px;
   
  margin: 3px;
  height: 110px;
  width: 110px;

  @media only screen and (max-width: 780px) {
    height: 70px;
    width: 70px;
  }
`;

const NewTagButton = styled.button`
  ${ tagButtonTemplate }
  border-color: ${ props => props.theme.colors.borderGold };
  ${ button }
`;

const DisabledNewTag = styled.button`
  ${ tagButtonTemplate }
  border-color: ${ props => props.theme.colors.borderDefault };
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
  currentlyEditing: CustomTag | null;
  setEditMode: (editmode: boolean) => void;
  newTagProps: { name: string, color: string }
  handleEditTagClick: (id: string) => void;
  beginTagging: (tagId: string) => void;
}

const TagTileContainer: FC<TagTileContainerProps> = ({ customTags, editMode, currentlyEditing, setEditMode, newTagProps, handleEditTagClick, beginTagging }) => (
  <TagsContainer>
    { editMode ? <DisabledNewTag>New</DisabledNewTag> : (
      <NewTagButton onClick={ () => setEditMode(true) }>
        New
      </NewTagButton>
    ) }
    { customTags.map(tag => (
      <TagTile
        key={ tag.id }
        id={ tag.id }
        name={ tag.name }
        color={ tag.color }
        editMode={ editMode }
        handleEditTagClick={ handleEditTagClick }
        beginTagging={ beginTagging }
      />
    )) }
    { (editMode && !currentlyEditing) && <EmptyNewTag color={ newTagProps.color } disabled>{ newTagProps.name || '???' }</EmptyNewTag> }
  </TagsContainer>
);

export default TagTileContainer;
