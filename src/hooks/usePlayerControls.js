import { Sub } from '../models';
import { addSub, patchSub, removeSub } from '../store/sessionReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { setPlaying } from '../store/timelineReducer';
import { toast } from 'react-toastify';

export function usePlayerControls({ player }) {
  const dispatch = useDispatch();
  const selectedSpeaker = useSelector(store => store.session.selectedSpeaker);
  const playing = useSelector(store => store.timeline.playing);

  const togglePlay = () => {
    if (!window.timelineEngine) return;
    const engine = window.timelineEngine;

    if (playing) {
      dispatch(setPlaying(false));
      if (!player.paused) player.pause();
      engine.pause();
    } else {
      dispatch(setPlaying(true));
      if (player.paused) player.play();
      engine.play({ autoEnd: true });
    }
  };

  const startRecording = useCallback((time) => {
    if (!window.timelineEngine) return;
    const engine = window.timelineEngine;

    const sub = new Sub({
      speakerId: selectedSpeaker.id,
      start: time,
      end: time,
      text: '',
    });
    sub.recording = true;

    // sub.startOffset = ;
    // dispatch(setRecordingSub(sub));
    window.recordingSub = sub;
    dispatch(addSub(sub));

    setTimeout(() => {
      engine.play({ autoEnd: true });
      if (player.paused) player.play();
    }, 10);
  }, [window.timelineEngine, dispatch, player, togglePlay]);

  const completeRecording = useCallback(() => {
    if (window.recordingSub) {
      const recSub = window.recordingSub;
      if (recSub.end - recSub.start > 0.5) {
        dispatch(patchSub(recSub, { end: recSub.end }));
      } else {
        dispatch(removeSub(recSub));
        toast.info('Hold the button to record a subtitle');
      }

      if (!player.paused) player.pause();
      if (window.timelineEngine) window.timelineEngine.pause();
      dispatch(setPlaying(false));
    }
    delete window.recordingSub;
  }, [window.timelineEngine, dispatch, player]);

  return { startRecording, completeRecording, togglePlay };
}
