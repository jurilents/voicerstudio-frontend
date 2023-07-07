import { useCallback } from 'react';
import { getKeyCode } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { removeSub } from '../store/sessionReducer';

const HOTKEYS = {
  deleteSub: { key: 'BACKSPACE' },
  playPause: { key: ' ' },
  undo: { key: 'Z', meta: true },
  redo: { key: 'Z', meta: true, shift: true },
};

let playing = false;

function checkMetaKeys(event, hotkey) {
  return (!hotkey.meta || event.ctrlKey || event.metaKey)
    && (!hotkey.shift || event.shiftKey)
    && (!hotkey.alt || event.altKey);
}

export const useHotkeys = ({ player }) => {
  const dispatch = useDispatch();
  const { selectedSub } = useSelector(store => store.session);

  const handlePlayOrPause = useCallback(() => {
    if (!window.timelineEngine) return;
    const engine = window.timelineEngine;
    playing = !playing;
    if (engine.isPlaying !== playing) {
      if (engine.isPlaying) {
        console.log('-----pause');
        engine.pause();
        player.pause();
      } else {
        console.log('-----play');
        engine.play({ autoEnd: true });
        player.play();
      }
    }
  }, [player, window.timelineEngine]);

  return useCallback((event) => {
    if (!window.timelineEngine) return;
    const key = getKeyCode(event);
    if (!key) return;

    console.log('key', key);

    if (key === 'R') {
      return;
    }

    event.preventDefault();

    switch (key) {
      case HOTKEYS.deleteSub.key:
        console.log('deleting');
        if (!checkMetaKeys(event, HOTKEYS.deleteSub)) break;
        if (selectedSub) {
          console.log('selectedSub', selectedSub.duration);
          dispatch(removeSub(selectedSub));
        } else {
          console.warn('No sub selected!');
        }
        break;

      case ' ':
        console.log('space hot');
        if (!checkMetaKeys(event, HOTKEYS.playPause)) break;
        handlePlayOrPause();
        break;

      case 'Z':
        if (checkMetaKeys(event, HOTKEYS.undo)) {
          event.preventDefault();
          if (event.metaKey) {
            // undoSubs(); // TODO: undo
          }
        } else if (checkMetaKeys(event, HOTKEYS.redo)) {
          // TODO: redo
        }
        break;

      default:
        break;
    }
  }, [selectedSub, window.timelineEngine]);
};
