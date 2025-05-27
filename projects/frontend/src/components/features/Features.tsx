import { FC } from 'react';
import styled from 'styled-components';
import FiltersBar from './FiltersBar';
import SkipContainer from './SkipContainer';
import OptionsContainer from './OptionsContainer';
import SearchBar from '../SearchBar';
import { candyCaneBG } from '../../styles/mixins';
import { usePrefs } from '../../contexts/prefs-context';
import { useCustomTags } from '../../contexts/custom-tags-context';
import TaggingInstructions from '../toolbar/TaggingInstructions';

const FeaturesContainer = styled.div`
  padding: 12px 10px 8px;
  background-color: ${ props => props.theme.colors.innerA };

  ${ props => props.theme.name === 'Christmas' && candyCaneBG };
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
`;

const OptionsRow = styled(Row)`
  justify-content: space-between;

  > :last-child {
    display: flex;
  }

  > :last-child :nth-child(2) button {
    box-shadow: none;
  }

  > :last-child span {
    width: 4px;
    background-color: white;
    height: 42px;
    margin: 2px;
  }

  @media only screen and (max-width: ${ props => props.theme.params.widthSelector1 }px) {
    align-items: flex-start;
    flex-direction: column-reverse;

    > div {
      width: 100%;
    }

    > :last-child span:first-of-type {
      display: none;
    }
  }

  @media only screen and (max-width: ${ props => props.theme.params.widthSelector2 }px) {
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
  const { currentlyTagging } = useCustomTags();

  return (
    <FeaturesContainer>
      <Row>
        { currentlyTagging ? <TaggingInstructions tagName={ currentlyTagging.name } tagColor={ currentlyTagging.color } /> : <FiltersBar /> }
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
