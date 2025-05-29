import { FC } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import CustomTag from '../../models/custom-tag';
import TagFilterButton from './TagFilterButton';
import { usePrefs } from '../../contexts/prefs-context';
import { FilterButton } from '../../styles/components';

const FiltersBarMain = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  box-sizing: border-box;
  flex-grow: 1;

  > button {
    margin: 2px;
  }

  > p {
    margin: 0 5px;
  }

  @media only screen and (max-width: ${ props => props.theme.params.widthSelector2 }px) {
    > button {
      flex-grow: 1;
    }
  }
`;

const FiltersBar: FC = () => {
  const { sortRules, toggleFavs } = usePrefs();
  const { data: customTags } = useSWR<CustomTag[]>('/api/tags');

  return (
    <FiltersBarMain>
      <FilterButton
        $toggled={ sortRules.favorites }
        onClick={ toggleFavs }
      >
        Favorites
      </FilterButton>
      { customTags ? customTags.map(x => <TagFilterButton key={ x.id } id={ x.id } name={ x.name } color={ x.color } />) : <p>loading tags...</p>}
    </FiltersBarMain>
  );
};

export default FiltersBar;
