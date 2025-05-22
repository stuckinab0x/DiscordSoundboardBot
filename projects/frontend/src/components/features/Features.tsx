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

  > span {
    width: 4px;
    background-color: white;
    height: 42px;
    margin: 0 8px;
  }

  @media only screen and (max-width: 780px) {

    > span {
      display: none;
    }
  }
`;

const OptionsRow = styled(Row)`
  justify-content: space-between;
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
        <span />
        <SkipContainer />
        <span />
        <OptionsContainer />
      </OptionsRow>
    </FeaturesContainer>
  );
};

export default Features;
