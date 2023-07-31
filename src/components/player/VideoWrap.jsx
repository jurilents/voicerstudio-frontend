import React, { createRef, memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setVideoDuration } from '../../store/sessionReducer';

export const VideoWrap = memo(({ setPlayer, setCurrentTime, setPlaying }) => {
  const $video = createRef();
  const dispatch = useDispatch();
  const settings = useSelector(store => store.settings);
  const videoUrl = useSelector(store => store.session.videoUrl) || '/samples/video_placeholder.mp4?t=1';
  // const selectedSpeaker = useSelector(store => store.session.selectedSpeaker);
  // const [playingSub, setPlayingSub] = useState(null);
  // const [endSubTime, setEndSubTime] = useState(0);

  useEffect(() => {
    if ($video.current) {
      $video.current.playbackRate = settings.playbackSpeed;
      if (settings.originalMute) {
        $video.current.volume = 0;
      } else {
        $video.current.volume = (settings.originalVolume || 1) * (settings.masterVolume || 1);
      }
    }
  }, [$video, settings.playbackSpeed]);

  useEffect(() => {
    if (!$video.current) return;

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

    const handlePlay = () => {
      if (!window.timelineEngine) return;
      const engine = window.timelineEngine;
      if (!engine.isPlaying) {
        engine.setTime(videoElm.currentTime);
        engine.play();
      }
    };

    const handlePause = () => {
      if (!window.timelineEngine) return;
      const engine = window.timelineEngine;
      if (engine.isPlaying) {
        engine.setTime(videoElm.currentTime);
        engine.pause();
      }
    };

    videoElm.onloadedmetadata = setupDuration;
    videoElm.addEventListener('timeupdate', handleTimeUpdate);
    videoElm.addEventListener('play', handlePlay);
    videoElm.addEventListener('pause', handlePause);
    return () => {
      setupDuration();
      videoElm.removeEventListener('timeupdate', handleTimeUpdate);
      videoElm.removeEventListener('play', handlePlay);
      videoElm.removeEventListener('pause', handlePause);
    };
  }, [$video]);

  useEffect(() => {
    setPlayer($video.current);
    //   (function loop() {
    //     window.requestAnimationFrame(() => {
    //       if ($video.current) {
    //         setPlaying(isPlaying($video.current));
    //         const currentTime = $video.current.currentTime || 0;
    //         setCurrentTime(currentTime);
    //       }
    //       loop();
    //     });
    //   })();
  }, [setPlayer, $video]);

  // const onClick = useCallback(() => {
  //   if ($video.current) {
  //     if (isPlaying($video.current)) {
  //       $video.current.pause();
  //     } else {
  //       $video.current.play();
  //     }
  //   }
  // }, [$video]);

  return <video src={videoUrl} ref={$video} />;
}, () => true);
