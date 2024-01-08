import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { button } from '../../styles/mixins';
import debounce from '../../utils';

const SkipContainerMain = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0;
  position: relative;
  z-index: 10;
  height: 100%;

  > button {
    ${ button }

    font-size: 1.3rem;
    color: white;
    background-color: ${ props => props.theme.colors.innerA };
    border: 5px solid ${ props => props.theme.colors.borderDefault };
    box-shadow: 0px 1px 8px 1px ${ props => props.theme.colors.shadowDefault };
    border-width: 5px;
    border-radius: 3px;
    width: 50%;
    margin-bottom: 6px;

    &:first-child {
      margin-right: 6px;
    }
  }

  @media only screen and (max-width: 780px) {
    > button {
      border-width: 3px;
      min-height: 50px;
      font-size: 1.6rem;
    }
  }
`;

const SkipContainer: FC = () => {
  const skipSound = useCallback(debounce(async (all?: boolean) => {
    const res = await fetch(`/api/queue/${ all && 'skip all' }`, { method: 'DELETE' });
    if (res.status === 401)
      window.location.reload();
  }, 500, true), []);

  return (
    <SkipContainerMain>
      <button type="button" onClick={ () => skipSound() }>
        Skip one
      </button>
      <button type="button" onClick={ () => skipSound(true) }>
        Skip all
      </button>
    </SkipContainerMain>
  );
};

export default SkipContainer;
