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
    margin: 0 2px;
  }

  > :first-child {
    margin-left: 0;
  }

  > :last-child {
    margin-right: 0;
  }

  @media only screen and (max-width: 780px) {
    > button {
      flex-grow: 1;
      margin: 0 2px;
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
