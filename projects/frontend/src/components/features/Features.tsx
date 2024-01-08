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
  padding-bottom: 8px;
  box-shadow: 0px 5px 5px 2px ${ props => props.theme.colors.shadowDefault };

  input {
    height: 30px;
  }

  ${ props => props.theme.name === 'christmas' && candyCaneBG };
`;

const UpperRow = styled.div`
  display: flex;
  margin: 20px 30px 10px;
  align-items: center;

  @media only screen and (max-width: 780px) {
    flex-direction: column;
    margin: 10px 10px 5px;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  margin: 10px 40px;
  padding: 6px;
  border-radius: 5px;
  background-color: ${ props => props.theme.colors.innerA };
  box-shadow: 0px 1px 8px 1px ${ props => props.theme.colors.shadowDefault };

  @media only screen and (max-width: 780px) {
    padding: 4px;
    margin: 2px 8px;
  }
`;

const SkipAndSearch = styled.div`
  display: flex;
  flex-direction: column;
  height: 94px;
  flex-grow: 1;
  margin: 0;

  span {
    top: 8px;
  }

  @media only screen and (max-width: 780px) {
    width: 100%;
    margin-bottom: 2px;
  }
`;

const Features: FC = () => {
  const { updateSearchTerm } = useSortRules();

  return (
    <FeaturesContainer>
      <UpperRow>
        <SkipAndSearch>
          <SkipContainer />
          <SearchBar setSearchTerm={ updateSearchTerm } focusOnEnter={ false } />
        </SkipAndSearch>
        <OptionsContainer />
      </UpperRow>
      <FiltersContainer>
        <FiltersBar />
      </FiltersContainer>
    </FeaturesContainer>
  );
};

export default Features;
