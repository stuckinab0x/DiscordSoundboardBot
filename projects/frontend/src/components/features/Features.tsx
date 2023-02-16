import React, { FC } from 'react';
import styled from 'styled-components';
import FiltersBar from './FiltersBar';
import SkipContainer from './SkipContainer';
import OptionsContainer from './OptionsContainer';
import SearchBar from '../SearchBar';
import { candyCaneBG } from '../../styles/mixins';
import { useSortRules } from '../../contexts/sort-rules-context';

const FeaturesContainer = styled.div`
  margin-top: 16px;
  padding: 0px 0px 14px;
  box-shadow: 0px 5px 5px 2px ${ props => props.theme.colors.shadowDefault };
  position: relative;

  input {
    height: 30px;
  }

  > div {
    display: flex;
    align-content: center;

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
  position: relative;
  z-index: 10;
  margin: 10px 40px;
  padding: 6px 6px;
  border-radius: 5px;
  background-color: ${ props => props.theme.colors.innerA };
  box-shadow: 0px 1px 8px 1px ${ props => props.theme.colors.shadowDefault };

  @media only screen and (max-width: 780px) {
    margin: 0.5vh 3vw 0vh;
  }
`;

const SkipAndSearch = styled.div`
  flex-grow: 1;
  margin: 0;

  @media only screen and (max-width: 780px) {
    display: flex;
    flex-direction: column;
    align-content: center;
    width: 95%;
  }
`;

const Features: FC = () => {
  const { updateSearchTerm } = useSortRules();

  return (
    <FeaturesContainer>
      <div>
        <SkipAndSearch>
          <SkipContainer />
          <SearchBar setSearchTerm={ updateSearchTerm } focusOnEnter={ false } />
        </SkipAndSearch>
        <OptionsContainer />
      </div>
      <FiltersContainer>
        <FiltersBar />
      </FiltersContainer>
    </FeaturesContainer>
  );
};

export default Features;
