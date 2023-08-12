import WaveSurfer from 'wavesurfer.js';
import { memo, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTotalTime } from '../../../../store/timelineReducer';

const AudioActionRenderer = ({ action, row }) => {
  const $domRef = useRef();
  const dispatch = useDispatch();
  const { waveZoom, timelineZoom } = useSelector(store => store.settings);
  const [wavesurfer, setWavesurfer] = useState();
  const [wavesurferOptions, setWavesurferOptions] = useState({
    container: $domRef.current,
    waveColor: 'rgb(175,175,175)',
    progressColor: 'rgb(100,100,100)',
    interact: false,
    fillParent: true,
    // media: action.data.player,
    // url: action.data.src,
    // minPxPerSec: 10,
    height: 80,
    barHeight: 1,
    // sampleRate: 8000,
  });

  useEffect(() => {
    wavesurferOptions.container = $domRef.current;
    setWavesurferOptions(wavesurferOptions);
  }, [$domRef.current, wavesurferOptions, setWavesurferOptions]);

  useEffect(() => {
    if (!$domRef.current || wavesurfer || !action.data.player || isNaN(+action.data.player.duration)) return;
    const ws = WaveSurfer.create(wavesurferOptions);
    ws.load(action.data.player);
    setWavesurfer(ws);
    dispatch(setTotalTime(ws.getDuration()));

    return () => {
      ws.destroy();
    };
  }, [$domRef, dispatch, setWavesurfer, action.data.player?.currentSrc]);

  useEffect(() => {
    if (!$domRef.current || !wavesurfer || !action.data.player || isNaN(+action.data.player.duration)) return;

    wavesurfer.drawer.containerWidth = wavesurfer.drawer.container.clientWidth;
    wavesurfer.drawBuffer();
  }, [$domRef.current, wavesurfer, timelineZoom, action.data.player]);

  // useEffect(() => {
  //   if ($domRef.current && wavesurfer) {
  //     console.log('waveform!>', wavesurfer.setHeight);
  //     console.log('waveform2!>', wavesurfer.setBarHeight);
  //     wavesurfer.setHeight(waveZoom);
  //   }
  // }, [$domRef.current, wavesurfer, wavesurferOptions, setWavesurferOptions, waveZoom]);

  return (
    <div ref={$domRef}
         style={{ marginTop: '10px' }}
         className='timeline-audio'>
      {/*{(action.end - action.start).toFixed(2)}s*/}
    </div>
  );
};

export default memo(
  AudioActionRenderer,
  (prevProps, nextProps) => {
    const prevData = prevProps.action?.data;
    const nextData = nextProps.action?.data;
    return !!nextData.player
      && !isNaN(+nextData.player.duration)
      && nextData.player.currentSrc === prevData?.player?.currentSrc;
  },
);
