import React, { FC } from 'react';
import styled from 'styled-components';
import * as mixins from '../../styles/mixins';

const OptionsFiltersContainerMain = styled.div`
  display: flex;
  justify-content: space-between;

  > div {
    display: flex;
  }
`;

interface ButtonProps {
  toggled: boolean;
}

const ButtonToggle = styled.button<ButtonProps>`
  ${ mixins.button }
  ${ mixins.filterButton }

  ${ props => props.toggled && `background-color: ${ props.theme.colors.buttonHighlighted };` }
`;

const AddSoundButton = styled.button<ButtonProps>`
  ${ mixins.filterButton }
  
  border-color: ${ props => props.theme.colors.borderGold };
    /* color gets overwritten by mobile 'button' css, same as green below */
  @media only screen and (max-width: 780px) {
    border-color: ${ props => props.theme.colors.borderGold };
  }

  ${ props => props.toggled ? mixins.buttonGreen : mixins.button }
`;

interface OptionsFiltersContainerProps {
  favoritesToggled: boolean;
  toggleFavs: () => void;
  previewToggled: boolean;
  toggleShowPreview: () => void;
  disableAddSoundButton: boolean;
  showAddSound: boolean;
  setShowAddSound: (set: boolean) => void;
}

const OptionsFiltersContainer: FC<OptionsFiltersContainerProps> = ({
  favoritesToggled,
  toggleFavs,
  previewToggled,
  toggleShowPreview,
  disableAddSoundButton,
  showAddSound,
  setShowAddSound,
}) => (
  <OptionsFiltersContainerMain>
    <div>
      <ButtonToggle
        toggled={ favoritesToggled }
        onClick={ toggleFavs }
      >
        Favorites
      </ButtonToggle>
    </div>
    <div>
      <ButtonToggle
        toggled={ previewToggled }
        onClick={ toggleShowPreview }
      >
        Preview Sounds
      </ButtonToggle>
      <AddSoundButton
        toggled={ disableAddSoundButton }
        disabled={ disableAddSoundButton }
        onClick={ () => setShowAddSound(!showAddSound) }
      >
        Add Sound
      </AddSoundButton>
    </div>
  </OptionsFiltersContainerMain>
);

export default OptionsFiltersContainer;
