import { FC } from 'react';
import styled from 'styled-components';
import { useCustomTags } from '../../contexts/custom-tags-context';
import { button } from '../../styles/mixins';
import { InnerShadow } from '../../styles/components';

interface TagStyleProps {
  color: string;
}

const TagTileMain = styled.div<TagStyleProps>`
  position: relative;
  
  > button {
    font-size: 1.1rem;
    color: white;
    background-color: ${ props => props.color };
    border: 4px solid ${ props => props.theme.colors.accent };
    border-radius: 4px;
    text-shadow: 1px 1px 3px ${ props => props.theme.colors.shadowDefault };
    position: relative;
   
    margin: 3px;
    height: 110px;
    width: 110px;
    
    ${ button }

    @media only screen and (max-width: 780px) {
      height: 70px;
      width: 70px;
      border: 3px solid ${ props => props.theme.colors.accent };
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
}

const TagTile: FC<TagTileProps> = ({ id, name, color, editMode, handleEditTagClick }) => {
  const { beginTagging } = useCustomTags();

  return (
    <TagTileMain color={ color }>
      <button type='button' onClick={ () => editMode ? null : beginTagging(id) }>
        <InnerShadow />
        { name }
      </button>
      <span className='material-icons' role='presentation' onClick={ () => handleEditTagClick(id) }>edit</span>
    </TagTileMain>
  );
};

export default TagTile;
