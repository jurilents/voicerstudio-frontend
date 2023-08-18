import { useCallback } from 'react';
import { getKeyCode } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import { patchSub, removeSub, setMarker } from '../store/sessionReducer';
import timeMachine from '../utils/TimeMachine';
import { toast } from 'react-toastify';
import { usePlayerControls } from './usePlayerControls';
import { setSettings } from '../store/settingsReducer';
import { Marker } from '../models';
import colors from '../utils/colors';

// meta: CTRL / COMMAND
// shift: SHIFT
// alt: ALT / OPTION

const HOTKEYS = {
  deleteSub: { key: 'BACKSPACE' },
  playPause: { key: 'SPACE' },
  record: { key: 'KEYR' },
  pasteSubText: { key: 'KEYV', meta: true },
  save: { key: 'KEYS', meta: true },
  refreshPage: { key: 'KEYR', meta: true },
  undo: { key: 'KEYZ', meta: true },
  redo: { key: 'KEYZ', meta: true, shift: true },
  setMarker: { key: 'KEYM' },
  speakAll: { key: 'KEYG', meta: true },
  showMotivation: { key: 'KEYO', meta: true, shift: true },
  moveRight: { key: 'ARROWRIGHT' },
  // moveCursorVeryRight: { key: 'ARROWRIGHT', shift: true },
  // moveCursorToNextMarker: { key: 'ARROWRIGHT', alt: true },
  moveLeft: { key: 'ARROWLEFT' },
  // moveCursorVeryLeft: { key: 'ARROWLEFT', shift: true },
  // moveCursorToPrevMarker: { key: 'ARROWLEFT', alt: true },
};

let playing = false;
let holdingRecord = false;

function checkMetaKeys(event, hotkey) {
  return (!hotkey.meta || event.ctrlKey || event.metaKey)
    && (!hotkey.shift || event.shiftKey)
    && (!hotkey.alt || event.altKey);
}

function metaKeyPressed(event) {
  return event.ctrlKey || event.metaKey;
}

function shiftKeyPressed(event) {
  return event.shiftKey;
}

function altKeyPressed(event) {
  return event.altKey;
}

export const useHotkeys = ({ player }) => {
  const dispatch = useDispatch();
  const { selectedSub, markers } = useSelector(store => store.session);
  const { startRecording, completeRecording, play, pause } = usePlayerControls(player);

  const createDefaultMarker = useCallback(() => {
    let maxMarkerId = Math.max.apply(null, markers.map(x => x.id));
    if (isNaN(+maxMarkerId) || maxMarkerId < 0) maxMarkerId = 0;
    maxMarkerId++;

    return new Marker({
      id: maxMarkerId,
      text: `Marker #${maxMarkerId}`,
      color: colors.randomColor(),
      time: window.timelineEngine.getTime(),
    });
  }, [markers]);

  const handlePlayOrPause = useCallback(() => {
    if (!window.timelineEngine) return;
    const engine = window.timelineEngine;
    playing = !playing;
    if (engine.isPlaying !== playing) {
      if (engine.isPlaying) pause();
      else play();
    }
  }, [play, pause]);

  const onKeyDown = useCallback(async (event) => {
    if (!window.timelineEngine) return;
    const engine = window.timelineEngine;

    const key = getKeyCode(event);
    if (!key) return;

    if (key !== 'KEYF' || !checkMetaKeys(event, { meta: true })) {
      event.preventDefault();
    }

    switch (key) {

      // ----- Fake hotkeys and overrides -----
      case HOTKEYS.save.key: {
        if (!checkMetaKeys(event, HOTKEYS.save)) break;
        toast.success(`Calm down, it's okay, everything is auto-saved 😎`);
        break;
      }

      case HOTKEYS.showMotivation.key: {
        if (!checkMetaKeys(event, HOTKEYS.showMotivation)) break;
        dispatch(setSettings({ showCat: true }));
        toast.dark(<div style={{ textAlign: 'center' }}>
          Ты котик — у тебя все получится
          <br />
          <div style={{ marginTop: '15px' }}>/ᐠ｡ꞈ｡ᐟ✿\</div>
          <img src='/images/cats/transparent.gif' alt='Тут был кот' style={{ width: '100%' }} />
        </div>, {});
        break;
      }

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

      // ----- Set Marker -----
      case HOTKEYS.setMarker.key: {
        if (!checkMetaKeys(event, HOTKEYS.setMarker)) break;
        if (!window.timelineEngine) return;
        const marker = createDefaultMarker();
        dispatch(setMarker(marker));
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

      // ----- Move cursor right |——>  -----
      case HOTKEYS.moveRight.key: {
        if (shiftKeyPressed(event)) {
          // Move cursor x10 times forward when SHiFT pressed
          pause();
          const newTime = Math.min(engine.getTime() + 1, player.duration);
          engine.setTime(newTime);
          player.currentTime = newTime;
        } else if (altKeyPressed(event)) {
          // Move cursor to next marker
          pause();
          const currentTime = engine.getTime();
          let targetTime = markers.find(x => x.time > currentTime)?.time;
          if (!targetTime) targetTime = player.duration || currentTime;
          engine.setTime(targetTime);
        } else if (checkMetaKeys(event, HOTKEYS.moveRight)) {
          // Move cursor forward
          pause();
          const newTime = Math.min(engine.getTime() + 0.1, player.duration);
          engine.setTime(newTime);
          player.currentTime = newTime;
        }
        break;
      }

      // ----- Move cursor left <——|  -----
      case HOTKEYS.moveLeft.key: {
        if (shiftKeyPressed(event)) {
          // Move cursor x10 times backward when SHiFT pressed
          pause();
          const newTime = Math.max(engine.getTime() - 1, 0);
          engine.setTime(newTime);
          player.currentTime = newTime;
        } else if (altKeyPressed(event)) {
          // Move cursor to previous marker
          pause();
          const currentTime = engine.getTime();
          let targetTime = markers.findLast(x => x.time < currentTime)?.time;
          if (!targetTime) targetTime = 0;
          engine.setTime(targetTime);
        } else if (checkMetaKeys(event, HOTKEYS.moveLeft)) {
          // Move cursor backward
          pause();
          const newTime = Math.max(engine.getTime() - 0.1, 0);
          engine.setTime(newTime);
          player.currentTime = newTime;
        }
        break;
      }

      // ----- Speak All -----
      case HOTKEYS.speakAll.key: {
        if (!checkMetaKeys(event, HOTKEYS.speakAll)) break;
        // TODO: speak all by hotkey
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
        if (checkMetaKeys(event, HOTKEYS.refreshPage)) {
          toast.info('Refresh page hotkey disabled. Use browser button if you really want to refresh the page 😘');
          break;
        }

        if (!checkMetaKeys(event, HOTKEYS.record)) break;
        if (!holdingRecord) {
          console.log('rec start');
          holdingRecord = true;
          const play = !altKeyPressed(event);
          startRecording(window.currentTime, play);
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

      default:
        break;
    }
  }, [dispatch, createDefaultMarker, handlePlayOrPause, startRecording, selectedSub, player, pause]);

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
