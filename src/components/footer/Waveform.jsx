import React, { createRef, memo, useEffect } from 'react';
import WFPlayer from 'wfplayer';
import { useSelector } from 'react-redux';

export const Waveform = memo((
  { player, waveform, setWaveform, setRender }) => {
  const $waveform = createRef();
  const settings = useSelector(store => store.settings);

  useEffect(() => {
    [...WFPlayer.instances].forEach((item) => item.destroy());

    const waveform = new WFPlayer({
      scrollable: settings.scrollableMode || false,
      scrollbar: true,
      ruler: true,
      progress: true,
      useWorker: false,
      duration: 10,
      padding: 1,
      wave: true,
      pixelRatio: 2,
      container: $waveform.current,
      mediaElement: player,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      waveColor: 'rgba(255, 255, 255, 0.2)',
      progressColor: 'rgba(255, 255, 255, 0.5)',
      gridColor: 'rgba(255, 255, 255, 0.05)',
      rulerColor: 'rgba(255, 255, 255, 0.5)',
      paddingColor: 'rgba(0, 0, 0, 0)',
    });

    setWaveform(waveform);
    waveform.on('update', setRender);
    waveform.load('/samples/sample.mp3');
  }, []);

  return (
    <div className='waveform' ref={$waveform} />
  );
}, () => true);
