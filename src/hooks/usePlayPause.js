import { setPlaying } from '../store/timelineReducer';
import { useDispatch } from 'react-redux';

export const usePlayPause = (player) => {
    const dispatch = useDispatch();

    const play = () => {
        if (!window.timelineEngine) return;
        dispatch(setPlaying(true));
        if (player.paused) player.play();
        window.timelineEngine.play({ autoEnd: true });
    };

    const pause = () => {
        if (!window.timelineEngine) return;
        dispatch(setPlaying(false));
        if (!player.paused) player.pause();
        window.timelineEngine.pause();
    };

    return { play, pause };
};
