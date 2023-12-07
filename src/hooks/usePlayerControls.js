import {Sub} from '../models';
import {addSub, patchSub} from '../store/sessionReducer';
import {useDispatch, useSelector} from 'react-redux';
import {useCallback} from 'react';
import {setPlaying} from '../store/timelineReducer';
import {usePlayPause} from './usePlayPause';
import {toast} from 'react-toastify';

export const usePlayerControls = (player) => {
  const dispatch = useDispatch();
  const selectedSpeaker = useSelector((store) => store.session.selectedSpeaker);
  const playing = useSelector((store) => store.timeline.playing);
  const {play, pause} = usePlayPause(player);

  const togglePlay = () => {
    if (playing) pause();
    else play();
  };

  const startRecording = useCallback(
    (time, play = true) => {
      if (!window.timelineEngine) return;
      const engine = window.timelineEngine;
      if (isNaN(+time)) {
        toast.error(`Cannot start recording. Please, refresh this page and try again...`);
        return;
      }

      const sub = new Sub({
        speakerId: selectedSpeaker.id,
        start: +time.toFixed(3),
        end: +time.toFixed(3),
        text: '',
      });
      sub.recording = true;

      window.recordingSub = sub;
      dispatch(addSub(sub));

      if (play) {
        setTimeout(() => {
          engine.play({autoEnd: true});
          if (player.paused) player.play();
        }, 10);
      }
    },
    [selectedSpeaker, dispatch, player, togglePlay],
  );

  const completeRecording = useCallback(() => {
    if (window.recordingSub) {
      const recSub = window.recordingSub;
      if (recSub.end - recSub.start > 0.5) {
        dispatch(patchSub(recSub, {end: +recSub.end.toFixed(3)}));
      } else {
        dispatch(patchSub(recSub, {end: +(recSub.start + 1).toFixed(3)}));
        // dispatch(removeSub(recSub));
        // toast.info('Hold the button to record a subtitle');
      }

      if (!player.paused) player.pause();
      if (window.timelineEngine) window.timelineEngine.pause();
      dispatch(setPlaying(false));
    }
    delete window.recordingSub;
  }, [dispatch, player]);

  return {startRecording, completeRecording, togglePlay, play, pause};
};
