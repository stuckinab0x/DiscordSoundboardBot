import React, { FC } from 'react';
import styled from 'styled-components';
import SearchContainer from './SearchContainer';
import FiltersBar from './FiltersBar';
import SkipContainer from './SkipContainer';
import OptionsContainer from './OptionsContainer';
import TagProps from '../../models/tag-props';
import { candyCaneBG } from '../../styles/mixins';

const FeaturesContainer = styled.div`
  padding: 0px 0px 14px;
  box-shadow: 0px 5px 5px 2px ${ props => props.theme.colors.shadowDefault };
  position: relative;

  > div {
    display: flex;

    &:first-child {
      padding: 0px 30px;
    }

    @media only screen and (max-width: 780px) {
      flex-direction: column;

      &:first-child {
        align-items: center;
        padding: 0px 6px;
      }
    }
  }

  ${ props => props.theme.name === 'christmas' && candyCaneBG };
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  margin: 10px 3.2vw;
  padding: 6px 6px;
  border-radius: 5px;
  background-color: ${ props => props.theme.colors.innerA };
  box-shadow: 0px 1px 8px 1px ${ props => props.theme.colors.shadowDefault };

  @media only screen and (max-width: 780px) {
    margin: 0.5vh 3vw 0vh;
  }
`;

interface FeaturesProps {
  favoritesToggled: boolean;
  previewToggled: boolean;
  toggleFavs: () => void;
  toggleShowPreview: () => void;
  showCustomTagPicker: boolean;
  toggleShowCustomTagPicker: () => void;
  customTagProps: TagProps[] | undefined;
  toggleSoundGrouping: () => void;
  toggleTagFilter: (tagId: string) => void;
  disableEditTagsButton: boolean;
  setSearchTerm: (search: string) => void;
  soundSortOrder: string;
  toggleSoundSortOrder: () => void;
}

const Features: FC<FeaturesProps> = ({
  favoritesToggled,
  previewToggled,
  toggleFavs,
  toggleShowPreview,
  showCustomTagPicker,
  toggleShowCustomTagPicker,
  customTagProps,
  toggleSoundGrouping,
  toggleTagFilter,
  disableEditTagsButton,
  setSearchTerm,
  soundSortOrder,
  toggleSoundSortOrder,
}) => (
  <FeaturesContainer>
    <div>
      <SkipContainer />
      <OptionsContainer
        disableEditTagsButton={ disableEditTagsButton }
        showCustomTagPicker={ showCustomTagPicker }
        toggleShowCustomTagPicker={ toggleShowCustomTagPicker }
        previewToggled={ previewToggled }
        toggleShowPreview={ toggleShowPreview }
        toggleSoundGrouping={ toggleSoundGrouping }
        soundSortOrder={ soundSortOrder }
        toggleSoundSortOrder={ toggleSoundSortOrder }
      />
    </div>
    <FiltersContainer>
      <SearchContainer setSearchTerm={ setSearchTerm } focusOnEnter={ false } />
      <FiltersBar
        favoritesToggled={ favoritesToggled }
        toggleFavs={ toggleFavs }
        customTagProps={ customTagProps }
        toggleTagFilter={ toggleTagFilter }
      />
    </FiltersContainer>
  </FeaturesContainer>
);

export default Features;
