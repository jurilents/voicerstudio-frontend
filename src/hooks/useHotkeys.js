import { useCallback } from 'react';
import { getKeyCode } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { removeSub } from '../store/sessionReducer';

export const useHotkeys = ({ playing, setPlaying }) => {
  const dispatch = useDispatch();
  const { selectedSub } = useSelector(store => store.session);

  return useCallback((event) => {
    const key = getKeyCode(event);
    console.log('key', key);
    switch (key) {
      case 'backspace':
      case 'delete':
        event.preventDefault();
        if (selectedSub) {
          dispatch(removeSub(selectedSub));
        } else {
          console.warn('No sub selected!');
        }
        break;
      case ' ':
        event.preventDefault();
        setPlaying(!playing);
        break;
      case 'z':
        event.preventDefault();
        event.preventDefault();
        if (event.metaKey) {
          // undoSubs(); // TODO: undo
        }
        break;
      default:
        break;
    }
  }, [playing]);
};
