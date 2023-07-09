import { useCallback } from 'react';
import { getKeyCode } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { patchSub, removeSub } from '../store/sessionReducer';
import timeMachine from '../utils/TimeMachine';

const HOTKEYS = {
  deleteSub: { key: 'BACKSPACE' },
  playPause: { key: ' ' },
  pasteSubText: { key: 'V', meta: true },
  undo: { key: 'Z', meta: true },
  redo: { key: 'Z', meta: true, shift: true },
  moveCursorRight: { key: 'ARROWRIGHT' },
  moveCursorVeryRight: { key: 'ARROWRIGHT', shift: true },
  moveCursorLeft: { key: 'ARROWLEFT' },
  moveCursorVeryLeft: { key: 'ARROWLEFT', shift: true },
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

  return useCallback(async (event) => {
    if (!window.timelineEngine) return;
    const engine = window.timelineEngine;
    const key = getKeyCode(event);
    if (!key) return;

    console.log('key', key);

    if (key === 'R') {
      return;
    }

    event.preventDefault();

    switch (key) {

      // ----- Delete -----
      case HOTKEYS.deleteSub.key: {
        if (!checkMetaKeys(event, HOTKEYS.deleteSub)) break;
        if (selectedSub) {
          dispatch(removeSub(selectedSub));
        } else {
          console.warn('No sub selected!');
        }
        break;
      }

      // ----- Paste subtitle text -----
      case HOTKEYS.pasteSubText.key: {
        if (!checkMetaKeys(event, HOTKEYS.pasteSubText)) break;
        if (selectedSub) {
          try {
            const text = await navigator.clipboard.readText();
            dispatch(patchSub(selectedSub, { text }));
          } catch (e) {
            console.warn('Cannot paste text from clipboard :(');
          }
        } else {
          console.warn('No sub selected!');
        }
        break;
      }

      // ----- Move cursor right |–>  -----
      case HOTKEYS.moveCursorRight.key: {
        if (checkMetaKeys(event, HOTKEYS.moveCursorVeryRight)) {
          const newTime = Math.min(engine.getTime() + 1, player.duration);
          engine.setTime(newTime);
          player.currentTime = newTime;
        } else if (checkMetaKeys(event, HOTKEYS.moveCursorRight)) {
          const newTime = Math.min(engine.getTime() + 0.1, player.duration);
          engine.setTime(newTime);
          player.currentTime = newTime;
        }
        break;
      }
      // ----- Move cursor left <–|  -----
      case HOTKEYS.moveCursorLeft.key: {
        if (checkMetaKeys(event, HOTKEYS.moveCursorVeryLeft)) {
          const newTime = Math.max(engine.getTime() - 1, 0);
          engine.setTime(newTime);
          player.currentTime = newTime;
        } else if (checkMetaKeys(event, HOTKEYS.moveCursorLeft)) {
          const newTime = Math.max(engine.getTime() - 0.1, 0);
          engine.setTime(newTime);
          player.currentTime = newTime;
        }
        break;
      }

      // ----- Play / Pause -----
      case HOTKEYS.playPause.key: {
        if (!checkMetaKeys(event, HOTKEYS.playPause)) break;
        handlePlayOrPause();
        break;
      }

      // ----- UnDo / ReDo -----
      case HOTKEYS.undo.key:
        if (checkMetaKeys(event, HOTKEYS.redo)) {
          const redo = timeMachine.redo();
          if (redo) dispatch(redo);
        } else if (checkMetaKeys(event, HOTKEYS.undo)) {
          const undo = timeMachine.undo();
          if (undo) dispatch(undo);
        }
        break;

      default:
        break;
    }
  }, [selectedSub, window.timelineEngine]);
};
