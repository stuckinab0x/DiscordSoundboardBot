import { FC } from 'react';
import styled, { css } from 'styled-components';
import tagColors from '../../tag-colors';
import { button } from '../../styles/mixins';

const ColorPickerMain = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: max-content;
  justify-content: center;
`;

const selectionDot = css`
  &:after {
    content: '';
    position: absolute;
    z-index: 1;
    width: 20px;
    height: 20px;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0 0 6px ${ props => props.theme.colors.shadowDefault };
    top: 10px;
    left: 10px;
  }
`;
interface ColorTileProps {
  $color: string;
  $selected: boolean;
}

const ColorTile = styled.button<ColorTileProps>`
  background-color: ${ props => props.$color };

  position: relative;

  ${ button }
  height: 40px;
  width: 40px;
  border: none;
  box-shadow: 0 0 2px ${ props => props.theme.colors.shadowDefault };
  ${ props => props.$selected && selectionDot }
`;

interface TagColorPickerProps {
  currentColor: string;
  selectColor: (colorId: string) => void;
}

const TagColorPicker: FC<TagColorPickerProps> = ({ currentColor, selectColor }) => (
  <ColorPickerMain>
    { tagColors.map(x => <ColorTile key={ x } onClick={ () => selectColor(x) } $selected={ currentColor === x } $color={ x } />) }
  </ColorPickerMain>
);

export default TagColorPicker;
