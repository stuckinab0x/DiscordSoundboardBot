import { FC } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import CustomTag from '../../models/custom-tag';
import TagFilterButton from './TagFilterButton';
import * as mixins from '../../styles/mixins';
import { usePrefs } from '../../contexts/prefs-context';
import { InnerShadow } from '../../styles/components';

const FiltersBarMain = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  > button {
    margin-right: 5px;
  }
`;

interface ButtonProps {
  toggled: boolean;
}

const ButtonToggle = styled.button<ButtonProps>`
  ${ mixins.button }
  ${ mixins.filterButton }
  ${ mixins.filterButtonMobile }
  ${ mixins.textShadowVisibility }

  box-shadow: 0px 0px 10px 0px ${ props => props.theme.colors.shadowDefault };
  position: relative;
  
  @media only screen and (max-width: 780px) {
    margin: 2px;
  }

  ${ props => props.toggled && `background-color: ${ props.theme.colors.buttonHighlighted };` }
`;

const FiltersBar: FC = () => {
  const { sortRules, toggleFavs } = usePrefs();
  const { data: customTags } = useSWR<CustomTag[]>('/api/tags');

  return (
    <FiltersBarMain>
      <ButtonToggle
        toggled={ sortRules.favorites }
        onClick={ toggleFavs }
      >
        <InnerShadow />
        Favorites
      </ButtonToggle>
      { customTags ? customTags.map(x => <TagFilterButton key={ x.id } id={ x.id } name={ x.name } color={ x.color } />) : <p>loading tags...</p>}
    </FiltersBarMain>
  );
};

export default FiltersBar;
