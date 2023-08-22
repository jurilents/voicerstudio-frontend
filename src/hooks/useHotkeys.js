import { useCallback } from 'react';
import { getKeyCode } from '../utils';
import { useDispatch, useSelector } from 'react-redux';
import hotkeys from '../utils/HotkeyController';
import { usePlayerControls } from './usePlayerControls';
import { ensureHotkeyHandlersRegistered } from '../utils/hotkeyHandlers';

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

export const useHotkeys = ({ player }) => {
  const dispatch = useDispatch();
  const session = useSelector(store => store.session);
  const settings = useSelector(store => store.settings);
  const controls = usePlayerControls(player);

  console.log('....controls....');

  ensureHotkeyHandlersRegistered();

  const createHandlerContext = useCallback((event) => {
    return {
      event,
      engine: window.timelineEngine,
      session,
      settings,
      player,
      dispatch,
      controls,
    };
  }, [session, settings, player, dispatch, controls]);

  const onKeyDown = useCallback(async (event) => {
    if (!window.timelineEngine) return;

    const key = getKeyCode(event);
    if (!key) return;

    if (key !== 'KEYF' || !checkMetaKeys(event, { meta: true })) {
      event.preventDefault();
    }

    const handler = hotkeys.findHandler(key, event);
    if (!handler) return;

    const handlersContext = createHandlerContext(event);
    const maybePromise = handler(handlersContext);
    if (maybePromise instanceof Promise) await maybePromise;

  }, [createHandlerContext]);

  const onKeyUp = useCallback(async (event) => {
    if (!window.timelineEngine) return;

    const key = getKeyCode(event);
    if (!key) return;

    event.preventDefault();

    const handler = hotkeys.findHandler(key, event);
    if (!handler) return;

    const handlersContext = createHandlerContext(event);
    const maybePromise = handler(handlersContext);
    if (maybePromise instanceof Promise) await maybePromise;

  }, [createHandlerContext]);

  return { onKeyDown, onKeyUp };
};
