import {useCallback} from 'react';
import {getKeyCode, isInputFocused} from '../utils';
import {useDispatch, useSelector} from 'react-redux';
import hotkeys from '../utils/HotkeyController';
import {usePlayerControls} from './usePlayerControls';
import {ensureHotkeyHandlersRegistered} from '../utils/hotkeyHandlers';
import {useVoicer} from './useVoicer';

ensureHotkeyHandlersRegistered();

function checkMetaKeys(event, hotkey) {
  return (
    (!hotkey.meta || event.ctrlKey || event.metaKey) &&
    (!hotkey.shift || event.shiftKey) &&
    (!hotkey.alt || event.altKey)
  );
}

export const useHotkeys = () => {
  const dispatch = useDispatch();
  const player = useSelector((store) => store.player.videoPlayer);
  const session = useSelector((store) => store.session);
  const settings = useSelector((store) => store.settings);
  const controls = usePlayerControls(player);
  const voicer = useVoicer();

  const createHandlerContext = useCallback(
    (event) => {
      return {
        event,
        engine: window.timelineEngine,
        session,
        settings,
        player,
        dispatch,
        controls,
        voicer,
      };
    },
    [session, settings, player, dispatch, controls],
  );

  const onKeyDown = useCallback(
    async (event) => {
      if (!window.timelineEngine) return;
      const key = getKeyCode(event);
      const inputFocused = isInputFocused();
      if (!key || inputFocused) return;

      if ((key !== 'KEYF' && key !== 'KEYR') || !checkMetaKeys(event, {meta: true})) {
        event.preventDefault();
      }

      const handler = hotkeys.findHandler(key, event);
      if (!handler) return;

      const handlersContext = createHandlerContext(event);
      const maybePromise = handler(handlersContext);
      if (maybePromise instanceof Promise) await maybePromise;
    },
    [createHandlerContext],
  );

  const onKeyUp = useCallback(
    async (event) => {
      if (!window.timelineEngine) return;

      const key = getKeyCode(event);
      if (!key) return;

      event.preventDefault();

      const handler = hotkeys.findHandler(key, event);
      if (!handler) return;

      const handlersContext = createHandlerContext(event);
      const maybePromise = handler(handlersContext);
      if (maybePromise instanceof Promise) await maybePromise;
    },
    [createHandlerContext],
  );

  return {onKeyDown, onKeyUp};
};
