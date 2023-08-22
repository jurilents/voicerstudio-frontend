import { memo, useEffect } from 'react';
import { useHotkeys } from '../hooks';


const HotkeysWrap = ({ player }) => {
  const { onKeyDown, onKeyUp } = useHotkeys({ player });

  // ---------- Timeline Hotkeys ----------
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [onKeyDown, onKeyUp]);

  return <></>;
};

export default memo(HotkeysWrap, (prevProps, nextProps) => {
  return prevProps.player === nextProps.player;
});
