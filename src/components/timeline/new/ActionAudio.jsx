import WaveSurfer from 'wavesurfer.js';
import { memo, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTotalTime } from '../../../store/timelineReducer';

const ActionAudio = ({ action, row }) => {
  const $domRef = useRef();
  const dispatch = useDispatch();
  const [wavesurfer, setWavesurfer] = useState();

  useEffect(() => {
    if (!$domRef.current
      || !wavesurfer && action.data.player
      && isNaN(+action.data.player.duration)) {
      return;
    }
    const ws = WaveSurfer.create({
      container: $domRef.current,
      waveColor: 'rgb(200,200,200)',
      progressColor: 'rgb(100,100,100)',
      interact: false,
      // media: action.data.player,
      // url: action.data.src,
      // minPxPerSec: 10,
      height: 80,
      // sampleRate: 8000,
    });
    ws.load(action.data.player);
    console.log('waveform!', ws);
    setWavesurfer(ws);
    dispatch(setTotalTime(ws.getDuration()));

    return () => {
      ws.destroy();
    };
  }, [$domRef, dispatch, setWavesurfer, action]);

  return (
    <div
      ref={$domRef}
      style={{ marginTop: '10px' }}
      className='timeline-audio'>
      {/*{(action.end - action.start).toFixed(2)}s*/}
    </div>
  );
};

export default memo(
  ActionAudio,
  (prevProps, nextProps) => {
    const prevData = prevProps.action?.data;
    const nextData = nextProps.action?.data;
    return !!nextData.player
      && !isNaN(+nextData.player.duration)
      && nextData.player.currentSrc === prevData?.player?.currentSrc;
  },
);
