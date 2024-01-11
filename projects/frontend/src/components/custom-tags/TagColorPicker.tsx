import React, { FC } from 'react';
import styled from 'styled-components';
import tagColors from '../../tag-colors';
import { button } from '../../styles/mixins';

const ColorPickerMain = styled.div`
  display: flex;

  position: absolute;
  top: 60px;
  left: -60px;

  background-color: ${ props => props.theme.colors.bg };
  border: 3px solid ${ props => props.theme.colors.accent };
  border-radius: 3px;
  box-shadow: 2px 2px 5px ${ props => props.theme.colors.shadowDefault };
`;

interface ColorTileProps {
  color: string;
}

const ColorTile = styled.button<ColorTileProps>`
  background-color: ${ props => props.color };

  ${ button }
  height: 40px;
  width: 40px;
`;

interface TagColorPickerProps {
  selectColor: (colorId: string) => void;
}

const TagColorPicker: FC<TagColorPickerProps> = ({ selectColor }) => (
  <ColorPickerMain>
    { tagColors.map(x => <ColorTile key={ x } onClick={ () => selectColor(x) } color={ x } />) }
  </ColorPickerMain>
);

export default TagColorPicker;
