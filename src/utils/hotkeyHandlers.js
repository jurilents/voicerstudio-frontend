import hotkeys from './HotkeyController';
import { patchSub, removeSub, setMarker } from '../store/sessionReducer';
import { Marker } from '../models';
import colors from './colors';
import { setSettings } from '../store/settingsReducer';
import { toast } from 'react-toastify';
import timeMachine from './TimeMachine';

let playing = false;
let holdingRecord = false;
let hotkeysRegistered = false;

export const ensureHotkeyHandlersRegistered = () => {
  if (!hotkeysRegistered) {
    hotkeysRegistered = true;
    registerAllHotkeys();
  }
};

/*
----- HOTKEYS MAP -----

====== Fake Hotkeys ======
[⌘ ⇧ O]  Show motivator
[⌘ S]    Fake save
[⌘ R]    Refresh page disabled

====== General ======
[⌘ V]    Paste subtitle text
[⌘ Z]    UnDo
[⌘ ⇧ Z]  ReDo

====== Timeline Control ======
[Space]  Play/pause
[M]      Set marker

====== Arrows ======
[–>]    Move cursor forward
[⇧ –>]  Move cursor x10 times forward
[⌥ –>]  Move cursor to next marker

[<–]    Move cursor backward
[⇧ <–]  Move cursor x10 times backward
[⌥ <–]  Move cursor to previous marker

====== Subtitles Control ======
[R]          Start/stop recording
[Backspace]  Delete subtitle
[⌘ G]        Speak all subtitles

*/

function registerAllHotkeys() {

  // ====================================== //
  // ============ Fake Hotkeys ============ //
  // ====================================== //

  // ====== Show motivator ====== //
  hotkeys.add('O', { meta: true, shift: true }, ({ dispatch }) => {
    dispatch(setSettings({ showCat: true }));
    toast.dark(<div style={{ textAlign: 'center' }}>
      Ты котик — у тебя все получится
      <br />
      <div style={{ marginTop: '15px' }}>/ᐠ｡ꞈ｡ᐟ✿\</div>
      <img src='/images/cats/transparent.gif' alt='Тут был кот' style={{ width: '100%' }} />
    </div>, {});
  });

  // ====== Fake save ====== //
  hotkeys.add('S', { meta: true }, ({}) => {
    toast.success(`Calm down, it's okay, everything is auto-saved 😎`);
  });

  // ====== Refresh page disabled ====== //
  hotkeys.add('R', { meta: true }, ({}) => {
    toast.info('Refresh page hotkey disabled. Use browser button if you really want to refresh the page 😘');
  });

  // ================================= //
  // ============ General ============ //
  // ================================= //

  // ====== Paste subtitle text ====== //
  hotkeys.add('V', { meta: true }, async ({ session, dispatch }) => {
    if (session.selectedSub) {
      try {
        const text = await navigator.clipboard.readText();
        dispatch(patchSub(session.selectedSub, { text }));
      } catch (e) {
        console.warn('Cannot paste text from clipboard :(');
      }
    } else {
      console.warn('No sub selected!');
    }
  });

  // ====== UnDo ====== //
  hotkeys.add('Z', { meta: true }, ({ dispatch }) => {
    const undo = timeMachine.undo();
    if (undo) dispatch(undo);
  });

  // ====== ReDo ====== //
  hotkeys.add('Z', { meta: true, shift: true }, ({ dispatch }) => {
    const redo = timeMachine.redo();
    if (redo) dispatch(redo);
  });

  // ========================================== //
  // ============ Timeline Control ============ //
  // ========================================== //

  // ====== Play/pause ====== //
  hotkeys.add('Space', {}, ({ controls }) => {
    if (!window.timelineEngine) return;
    const engine = window.timelineEngine;
    playing = !playing;
    if (engine.isPlaying !== playing) {
      if (engine.isPlaying) controls.pause();
      else controls.play();
    }
  });

  // ====== Set marker ====== //
  hotkeys.add('M', {}, ({ event, session, engine, dispatch }) => {
    let maxMarkerId = Math.max.apply(null, session.markers.map(x => x.id));
    if (isNaN(+maxMarkerId) || maxMarkerId < 0) maxMarkerId = 0;
    maxMarkerId++;

    const marker = new Marker({
      id: maxMarkerId,
      text: `Marker #${maxMarkerId}`,
      color: colors.randomColor(),
      time: engine.getTime(),
    });
    dispatch(setMarker(marker));
  });

  // ================================ //
  // ============ Arrows ============ //
  // ================================ //

  // ====== Move cursor right |——> ====== //
  hotkeys.add('ArrowRight', {}, async ({ player, engine, controls }) => {
    controls.pause();
    const newTime = Math.min(engine.getTime() + 0.1, player.duration);
    engine.setTime(newTime);
    player.currentTime = newTime;
  });
  // Move cursor x10 times backward when SHiFT pressed
  hotkeys.add('ArrowRight', { shift: true }, async ({ player, engine, controls }) => {
    controls.pause();
    const newTime = Math.min(engine.getTime() + 1, player.duration);
    engine.setTime(newTime);
    player.currentTime = newTime;
  });
  // Move cursor to next marker
  hotkeys.add('ArrowRight', { alt: true }, async ({ session, player, engine, controls }) => {
    controls.pause();
    const currentTime = engine.getTime();
    let targetTime = session.markers.find(x => x.time > currentTime)?.time;
    if (!targetTime) targetTime = player.duration || currentTime;
    engine.setTime(targetTime);
  });


  // ====== Move cursor left <——| ====== //
  hotkeys.add('ArrowLeft', {}, async ({ player, engine, controls }) => {
    controls.pause();
    const newTime = Math.max(engine.getTime() - 0.1, 0);
    engine.setTime(newTime);
    player.currentTime = newTime;
  });
  // Move cursor x10 times backward when SHiFT pressed
  hotkeys.add('ArrowLeft', { shift: true }, async ({ player, engine, controls }) => {
    controls.pause();
    const newTime = Math.max(engine.getTime() - 1, 0);
    engine.setTime(newTime);
    player.currentTime = newTime;
  });
  // Move cursor to previous marker
  hotkeys.add('ArrowLeft', { alt: true }, async ({ session, engine, controls }) => {
    controls.pause();
    const currentTime = engine.getTime();
    let targetTime = session.markers.findLast(x => x.time < currentTime)?.time;
    if (!targetTime) targetTime = 0;
    engine.setTime(targetTime);
  });

  // =========================================== //
  // ============ Subtitles Control ============ //
  // =========================================== //

  // ====== Start recording ====== //
  hotkeys.add('R', {}, ({ event, controls }) => {
    if (!holdingRecord) {
      console.log('rec start');
      holdingRecord = true;
      const play = !shiftKeyPressed(event);
      controls.startRecording(window.currentTime, play);
    }
  });
  hotkeys.add('R', { on: 'keyup' }, ({ controls }) => {
    if (holdingRecord) {
      console.log('rec done');
      holdingRecord = false;
      controls.completeRecording();
    }
  });

  // ====== Speak all ====== //
  hotkeys.add('G', { meta: true }, ({}) => {
    // TODO: speak all
  });

  // ====== Delete subtitle ====== //
  hotkeys.add('Backspace', {}, ({ session, dispatch }) => {
    if (session.selectedSub && !session.selectedSub.recording) {
      dispatch(removeSub(session.selectedSub));
    } else {
      console.warn('No sub selected!');
    }
  });
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
