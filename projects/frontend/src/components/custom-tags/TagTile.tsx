import React, { FC } from 'react';
import styled from 'styled-components';
import { button } from '../../styles/mixins';

interface TagStyleProps {
  color: string;
}

const TagTileMain = styled.div<TagStyleProps>`
  position: relative;
  
  > button {
    font-size: 1.1rem;
    color: white;
    background-color: ${ props => props.color };
    border: 4px solid ${ props => props.theme.colors.borderDefault };
    border-radius: 4px;
    text-shadow: 1px 1px 3px ${ props => props.theme.colors.shadowDefault };
   
    margin: 3px;
    height: 110px;
    width: 110px;
    
    ${ button }

    @media only screen and (max-width: 780px) {
      height: 70px;
      width: 70px;
      border: 3px solid ${ props => props.theme.colors.borderDefault };
      border-radius: 3px;
    }
  }

  > span {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    opacity: 50%;
    text-shadow: 1px 1px 3px ${ props => props.theme.colors.shadowDefault };

    &:hover {
      opacity: 100%;
    }

    @media only screen and (max-width: 780px) {
      font-size: 1.3rem;
    }
  }
`;

interface TagTileProps {
  id: string;
  name: string;
  color: string;
  editMode: boolean;
  handleEditTagClick: (id: string) => void;
  beginTagging: (tagId: string) => void;
}

const TagTile: FC<TagTileProps> = ({ id, name, color, editMode, handleEditTagClick, beginTagging }) => (
  <TagTileMain color={ color }>
    <button type='button' onClick={ () => editMode ? null : beginTagging(id) }>
      { name }
    </button>
    <span className='material-icons' role='presentation' onClick={ () => handleEditTagClick(id) }>edit</span>
  </TagTileMain>
);

export default TagTile;
