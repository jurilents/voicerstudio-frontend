import React, { createRef, memo, useCallback, useEffect, useState } from 'react';
import { isPlaying } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';

export const VideoWrap = memo(({ setPlayer, setCurrentTime, setPlaying }) => {
  const $video = createRef();
  const dispatch = useDispatch();
  const playbackSpeed = useSelector(store => store.settings.playbackSpeed);
  const videoUrl = useSelector(store => store.session.videoUrl) || '/samples/video_placeholder.mp4?t=1';
  const selectedSpeaker = useSelector(store => store.session.selectedSpeaker);
  const [playingSub, setPlayingSub] = useState(null);
  const [endSubTime, setEndSubTime] = useState(0);

  useEffect(() => {
    if ($video.current) {
      $video.current.playbackRate = playbackSpeed;
    }
  }, [$video, playbackSpeed]);


  useEffect(() => {
    setPlayer($video.current);
    (function loop() {
      window.requestAnimationFrame(() => {
        if ($video.current) {
          setPlaying(isPlaying($video.current));
          const currentTime = $video.current.currentTime || 0;
          setCurrentTime(currentTime);

          if (playingSub && playingSub.end < currentTime) {
            setPlayingSub(null);
            // console.log('next');
          }
          if (!playingSub) {
            const playingSub = selectedSpeaker.subs.find(x => x.start > currentTime);
            // console.log('playing', playingSub);
            setPlayingSub(playingSub);
          }
        }
        loop();
      });
    })();
  }, [setPlayer, setCurrentTime, setPlaying, $video]);

  const onClick = useCallback(() => {
    if ($video.current) {
      if (isPlaying($video.current)) {
        $video.current.pause();
      } else {
        $video.current.play();
      }
    }
  }, [$video]);

  return <video onClick={onClick} src={videoUrl} ref={$video} />;
}, () => true);
