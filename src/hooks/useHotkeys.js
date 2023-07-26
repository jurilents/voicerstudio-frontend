import { useCallback } from 'react';
import { getKeyCode } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { patchSub, removeSub } from '../store/sessionReducer';
import timeMachine from '../utils/TimeMachine';
import { toast } from 'react-toastify';
import { usePlayerControls } from './usePlayerControls';

const HOTKEYS = {
  deleteSub: { key: 'BACKSPACE' },
  playPause: { key: ' ' },
  record: { key: 'R' },
  pasteSubText: { key: 'V', meta: true },
  save: { key: 'S', meta: true },
  refreshPage: { key: 'R', meta: true },
  undo: { key: 'Z', meta: true },
  redo: { key: 'Z', meta: true, shift: true },
  showMotivation: { key: 'O', meta: true, shift: true },
  moveCursorRight: { key: 'ARROWRIGHT' },
  moveCursorVeryRight: { key: 'ARROWRIGHT', shift: true },
  moveCursorLeft: { key: 'ARROWLEFT' },
  moveCursorVeryLeft: { key: 'ARROWLEFT', shift: true },
};

let playing = false;
let holdingRecord = false;

function checkMetaKeys(event, hotkey) {
  return (!hotkey.meta || event.ctrlKey || event.metaKey)
    && (!hotkey.shift || event.shiftKey)
    && (!hotkey.alt || event.altKey);
}

export const useHotkeys = ({ player }) => {
  const dispatch = useDispatch();
  const selectedSub = useSelector(store => store.session.selectedSub);
  const { startRecording, completeRecording } = usePlayerControls({ player });

  const handlePlayOrPause = useCallback(() => {
    if (!window.timelineEngine) return;
    const engine = window.timelineEngine;
    playing = !playing;
    if (engine.isPlaying !== playing) {
      if (engine.isPlaying) {
        console.log('-----pause');
        engine.pause();
        if (!player.paused) player.pause();
      } else {
        console.log('-----play');
        engine.play({ autoEnd: true });
        if (player.paused) player.play();
      }
    }
  }, [player]);

  const onKeyDown = useCallback(async (event) => {
    if (!window.timelineEngine) return;
    const engine = window.timelineEngine;

    const key = getKeyCode(event);
    if (!key) return;

    event.preventDefault();

    switch (key) {

      // ----- Delete -----
      case HOTKEYS.deleteSub.key: {
        if (!checkMetaKeys(event, HOTKEYS.deleteSub)) break;
        if (selectedSub && !selectedSub.recording) {
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

      // ----- Record -----
      case HOTKEYS.record.key: {
        if (!checkMetaKeys(event, HOTKEYS.record)) break;
        if (!holdingRecord) {
          console.log('rec start');
          holdingRecord = true;
          startRecording(window.currentTime);
        }
        break;
      }

      // ----- UnDo / ReDo -----
      case HOTKEYS.undo.key: {
        if (checkMetaKeys(event, HOTKEYS.redo)) {
          const redo = timeMachine.redo();
          if (redo) dispatch(redo);
        } else if (checkMetaKeys(event, HOTKEYS.undo)) {
          const undo = timeMachine.undo();
          if (undo) dispatch(undo);
        }
        break;
      }

      // ----- Fake hotkeys and overrides -----
      case HOTKEYS.save.key: {
        if (!checkMetaKeys(event, HOTKEYS.save)) break;
        toast.success(`Calm down, it's okay, everything is saved 😎`);
        break;
      }

      case HOTKEYS.refreshPage.key: {
        if (!checkMetaKeys(event, HOTKEYS.refreshPage)) break;
        toast.info('Refresh page hotkey disabled. Use browser button if you really want to refresh the page 😘');
        break;
      }

      case HOTKEYS.showMotivation.key: {
        if (!checkMetaKeys(event, HOTKEYS.showMotivation)) break;
        toast.dark(<>Ты котик — у тебя все получится<br />/ᐠ｡ꞈ｡ᐟ✿\</>, {});
        break;
      }

      default:
        break;
    }
  }, [dispatch, handlePlayOrPause, selectedSub, player]);

  const onKeyUp = useCallback((event) => {
    if (!window.timelineEngine) return;
    const engine = window.timelineEngine;

    const key = getKeyCode(event);
    if (!key) return;

    event.preventDefault();

    switch (key) {
      // ----- Record -----
      case HOTKEYS.record.key: {
        if (!checkMetaKeys(event, HOTKEYS.record)) break;
        if (holdingRecord) {
          console.log('rec done');
          holdingRecord = false;
          completeRecording();
        }
        break;
      }

      default:
        break;
    }
  }, []);

  return { onKeyDown, onKeyUp };
};
