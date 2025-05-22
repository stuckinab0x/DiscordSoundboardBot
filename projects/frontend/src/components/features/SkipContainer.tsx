import { FC, useCallback } from 'react';
import styled from 'styled-components';
import { InnerShadow, OptionsButton } from '../../styles/components';
import { debounce } from '../../utils';

const SkipContainerMain = styled.div`
  display: flex;
  margin: 0;
`;

const SkipContainer: FC = () => {
  const skipSound = useCallback(debounce(async (all?: boolean) => {
    const res = await fetch(`/api/queue/${ all && 'skip all' }`, { method: 'DELETE' });
    if (res.status === 401)
      window.location.reload();
  }, 500, true), []);

  return (
    <SkipContainerMain>
      <OptionsButton onClick={ () => skipSound() }>
        <InnerShadow />
        Skip one
      </OptionsButton>
      <OptionsButton onClick={ () => skipSound(true) }>
        <InnerShadow />
        Skip all
      </OptionsButton>
    </SkipContainerMain>
  );
};

export default SkipContainer;
