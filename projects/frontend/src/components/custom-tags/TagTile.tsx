import { FC } from 'react';
import styled from 'styled-components';
import { useCustomTags } from '../../contexts/custom-tags-context';
import { button, tagButtonTemplate } from '../../styles/mixins';

interface TagStyleProps {
  $color: string;
}

const TagTileMain = styled.div<TagStyleProps>`
  position: relative;
  display: flex;
  
  > button {
    ${ tagButtonTemplate }
    background-color: ${ props => props.$color };
    text-shadow: 1px 1px 3px ${ props => props.theme.colors.shadowDefault };
    box-shadow: 0 0 2px 0 ${ props => props.theme.colors.shadowDefault };
    position: relative;
    overflow: hidden;
    word-wrap: break-word;

    ${ button }
  }

  > span {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    opacity: 50%;
    text-shadow: 1px 1px 3px ${ props => props.theme.colors.shadowDefault };
    user-select: none;

    &:hover {
      opacity: 1;
    }
  }
`;

interface TagTileProps {
  id: string;
  name: string | undefined;
  color: string | undefined;
  editMode: boolean;
  handleEditTagClick: (id: string) => void;
}

const TagTile: FC<TagTileProps> = ({ id, name, color, editMode, handleEditTagClick }) => {
  const { beginTagging } = useCustomTags();

  return (
    <TagTileMain $color={ color || 'black' }>
      <button type='button' onClick={ () => editMode ? null : beginTagging(id) }>
        { name }
      </button>
      <span className='material-icons' role='presentation' onClick={ () => handleEditTagClick(id) }>edit</span>
    </TagTileMain>
  );
};

export default TagTile;
