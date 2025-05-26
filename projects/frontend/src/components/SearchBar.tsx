import { FC, useCallback, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import * as mixins from '../styles/mixins';

const SearchBarMain = styled.div`
  display: flex;
  position: relative;
  flex-grow: 1;

  > input {
    ${ mixins.textInput }

    min-height: 42px;
    margin: 2px;

    ${ props => props.theme.name === 'Boomer' && 'font-size: 1.45rem;' }
  
    &::placeholder {
      color: rgb(199, 199, 199);
    }
  }

  @media only screen and (max-width: ${ props => props.theme.params.widthSelector2 }px) {
    > input {
      min-height: 30px;
    }
  }
`;

const ClearButton = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  right: 8px;
  opacity: 50%;
  min-height: 42px;
  margin: 2px 0;

  > span {
    cursor: pointer;
  
    &:hover {
      opacity: 100%;
    }
  }

  @media only screen and (max-width: ${ props => props.theme.params.widthSelector2 }px) {
    min-height: 30px;
  }
`;

interface SearchBarProps {
  setSearchTerm: (search: string) => void;
  focusOnEnter: boolean;
}

const SearchBar: FC<SearchBarProps> = ({ setSearchTerm, focusOnEnter }) => {
  const [showCancel, setShowCancel] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const textInput = useRef<HTMLInputElement>(null);

  const handleSearchInput = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    const searchTerm = event.currentTarget.value;
    setInputValue(searchTerm);
    setSearchTerm(searchTerm.toUpperCase());
    setShowCancel(Boolean(searchTerm));
  }, []);

  const handleCancelClick = useCallback(() => {
    setSearchTerm('');
    setShowCancel(false);
    setInputValue('');
    textInput.current?.focus();
  }, []);

  useEffect(() => {
    if (focusOnEnter)
      textInput.current?.focus();
  }, []);

  return (
    <SearchBarMain>
      <input
        type="text"
        placeholder=" search for a sound..."
        value={ inputValue }
        ref={ textInput }
        onChange={ event => handleSearchInput(event) }
      />
      { showCancel ? (
        <ClearButton>
          <span
            className="material-icons"
            role="presentation"
            onClick={ handleCancelClick }
          >
            cancel
          </span>
        </ClearButton>
      ) : null }
    </SearchBarMain>
  );
};

export default SearchBar;
