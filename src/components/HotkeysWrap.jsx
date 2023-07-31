import { useEffect } from 'react';
import { useHotkeys } from '../hooks';


export default function HotkeysWrap({ player }) {
  const { onKeyDown, onKeyUp } = useHotkeys({ player });

  // ---------- Timeline Hotkeys ----------
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown, onKeyUp]);

  return <></>;
}
