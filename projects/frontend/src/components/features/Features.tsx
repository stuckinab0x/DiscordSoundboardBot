import { FC } from 'react';
import styled from 'styled-components';
import FiltersBar from './FiltersBar';
import SkipContainer from './SkipContainer';
import OptionsContainer from './OptionsContainer';
import SearchBar from '../SearchBar';
import { candyCaneBG } from '../../styles/mixins';
import { usePrefs } from '../../contexts/prefs-context';

const FeaturesContainer = styled.div`
  padding: 12px 10px 8px;
  background-color: ${ props => props.theme.colors.innerA };

  ${ props => props.theme.name === 'Christmas' && candyCaneBG };

`;

const Row = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 2px;

  > :first-child {
    margin-left: 0;
  }
`;

const OptionsRow = styled(Row)`
  justify-content: space-between;

  > :last-child {
    display: flex;
    align-items: center;
  }

  > :last-child span {
    width: 4px;
    background-color: white;
    height: 42px;
    margin: 0 8px;
  }

  @media only screen and (max-width: 1200px) {
    align-items: flex-start;
    flex-direction: column-reverse;
    padding: 0 2px;
    
    > div {
      width: 100%;
      padding: 2px 0;
    }

    > div :first-child {
      margin-left: 0;
    }

    > :last-child span:first-of-type {
      display: none;
    }
  }

  @media only screen and (max-width: 780px) {
    > :last-child span {
      height: 30px;
    }

    > :last-child {
      flex-direction: column;

      > div {
        display: flex;
        width: 100%;

        button {
          flex-grow: 1;
        }
      }

      > span {
        display: none;
      }
    }
  }
`;

const Features: FC = () => {
  const { updateSearchTerm } = usePrefs();

  return (
    <FeaturesContainer>
      <Row>
        <FiltersBar />
      </Row>
      <OptionsRow>
        <SearchBar setSearchTerm={ updateSearchTerm } focusOnEnter={ false } />
        <div>
          <span />
          <SkipContainer />
          <span />
          <OptionsContainer />
        </div>
      </OptionsRow>
    </FeaturesContainer>
  );
};

export default Features;
