import { FC, useCallback } from 'react';
import { OptionsButton } from '../../styles/components';
import { debounce } from '../../utils';

const SkipContainer: FC = () => {
  const skipSound = useCallback(debounce(async (all?: boolean) => {
    const res = await fetch(`/api/queue/${ all && 'skip all' }`, { method: 'DELETE' });
    if (res.status === 401)
      window.location.reload();
  }, 500, true), []);

  return (
    <div>
      <OptionsButton onClick={ () => skipSound() }>
        Skip one
      </OptionsButton>
      <OptionsButton onClick={ () => skipSound(true) }>
        Skip all
      </OptionsButton>
    </div>
  );
};

export default SkipContainer;
