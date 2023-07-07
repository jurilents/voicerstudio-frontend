import React, { createRef, memo, useCallback, useEffect, useState } from 'react';
import { isPlaying } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { setVideoDuration } from '../../store/sessionReducer';

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
      $video.current.volume = 0;
    }
  }, [$video, playbackSpeed]);

  useEffect(() => {
    if ($video.current) {
      const videoElm = $video.current;
      const setupDuration = () => {
        if (!isNaN(videoElm.duration)) {
          dispatch(setVideoDuration(videoElm.duration));
        }
      };

      const handleTimeUpdate = () => {
        // if (window.timelineEngine) {
        //   window.timelineEngine.setTime(videoElm.currentTime);
        // }
      };

      videoElm.onloadedmetadata = setupDuration;
      videoElm.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        setupDuration();
        videoElm.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [$video]);

  useEffect(() => {
    setPlayer($video.current);
    (function loop() {
      window.requestAnimationFrame(() => {
        if ($video.current) {
          setPlaying(isPlaying($video.current));
          const currentTime = $video.current.currentTime || 0;
          setCurrentTime(currentTime);
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
