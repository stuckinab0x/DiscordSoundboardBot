import React, { FC, useCallback, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import * as mixins from '../styles/mixins';

const SearchBarMain = styled.div`
  display: flex;
  position: relative;
  box-shadow: 0px 1px 8px 1px ${ props => props.theme.colors.shadowDefault };

  > input {
    ${ mixins.textInput }
    ${ mixins.textInputMobile }
  
    &::placeholder {
      color: rgb(199, 199, 199);
    }
  }

  > span {
    ${ mixins.iconButton }
    right: 8px;
    top: 7px;
    position: absolute;
    opacity: 50%;
  
    &:hover {
      opacity: 100%;
    }
  
    @media only screen and (max-width: 780px) {
      right: 6px;
      top: 4px;
      font-size: 1.8rem;
    }
  }

  @media only screen and (max-width: 780px) {
    width: 100%;
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
        <span
          className="material-icons"
          role="presentation"
          onClick={ handleCancelClick }
        >
          cancel
        </span>
      ) : null }
    </SearchBarMain>
  );
};

export default SearchBar;
