import React, { FC } from 'react';
import styled from 'styled-components';
import TagProps from '../../models/tag-props';
import TagFilterButton from './TagFilterButton';
import * as mixins from '../../styles/mixins';

const FiltersBarMain = styled.div`
  display: flex;
  justify-content: left;
`;

interface ButtonProps {
  toggled: boolean;
}

const ButtonToggle = styled.button<ButtonProps>`
  ${ mixins.button }
  ${ mixins.filterButton }
  ${ mixins.filterButtonMobile }
  ${ mixins.textShadowVisibility }

  ${ props => props.toggled && `background-color: ${ props.theme.colors.buttonHighlighted };` }
`;

interface FiltersBarProps {
  favoritesToggled: boolean;
  toggleFavs: () => void;
  customTagProps: TagProps[] | undefined;
  toggleTagFilter: (tagId: string) => void;
}

const FiltersBar: FC<FiltersBarProps> = ({
  favoritesToggled,
  toggleFavs,
  customTagProps,
  toggleTagFilter,
}) => (
  <FiltersBarMain>
    <ButtonToggle
      toggled={ favoritesToggled }
      onClick={ toggleFavs }
    >
      Favorites
    </ButtonToggle>
    { customTagProps?.map(x => <TagFilterButton key={ x.id } id={ x.id } name={ x.name } color={ x.color } toggleTagFilter={ toggleTagFilter } />)}
  </FiltersBarMain>
);

export default FiltersBar;
