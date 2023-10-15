import { Sub } from '../models';
import { addSub, patchSub, removeSub } from '../store/sessionReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { setPlaying } from '../store/timelineReducer';
import { toast } from 'react-toastify';
import { usePlayPause } from './usePlayPause';
import timeMachine from '../utils/TimeMachine';

export const usePlayerControls = (player) => {
    const dispatch = useDispatch();
    const selectedSpeaker = useSelector((store) => store.session.selectedSpeaker);
    const playing = useSelector((store) => store.timeline.playing);
    const { play, pause } = usePlayPause(player);

    const togglePlay = () => {
        if (playing) pause();
        else play();
    };

    const startRecording = useCallback(
        (time, play = true) => {
            if (!window.timelineEngine) return;
            const engine = window.timelineEngine;

            const sub = new Sub({
                speakerId: selectedSpeaker.id,
                start: time,
                end: time,
                text: '',
            });
            sub.recording = true;

            window.recordingSub = sub;
            dispatch(addSub(sub));

            if (play) {
                setTimeout(() => {
                    engine.play({ autoEnd: true });
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
                dispatch(patchSub(recSub, { end: recSub.end }));
            } else {
                dispatch(patchSub(recSub, { end: recSub.start + 1 }));
                // dispatch(removeSub(recSub));
                // toast.info('Hold the button to record a subtitle');
            }

            if (!player.paused) player.pause();
            if (window.timelineEngine) window.timelineEngine.pause();
            dispatch(setPlaying(false));
        }
        delete window.recordingSub;
    }, [dispatch, player]);

    return { startRecording, completeRecording, togglePlay, play, pause };
};
