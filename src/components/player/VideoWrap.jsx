import React, {createRef, memo, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setVideoDuration} from '../../store/sessionReducer';
import {setVideoPlayer} from '../../store/playerReducer';

const VideoWrap = () => {
  const $video = createRef();
  const dispatch = useDispatch();
  const settings = useSelector((store) => store.settings);
  const videoUrl = useSelector((store) => store.session.videoUrl) || '/images/video_placeholder.mp4';

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

    const setupDuration = (event) => {
      const videoElm = event.target;
      if (!isNaN(+videoElm.duration)) {
        dispatch(setVideoDuration(videoElm.duration));
        dispatch(setVideoPlayer(videoElm));
      } else {
        console.error('Video did not load correctly', videoElm.duration);
      }
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
    // videoElm.addEventListener('timeupdate', handleTimeUpdate);
    videoElm.addEventListener('play', handlePlay);
    videoElm.addEventListener('pause', handlePause);
    return () => {
      setupDuration();
      // videoElm.removeEventListener('timeupdate', handleTimeUpdate);
      videoElm.removeEventListener('play', handlePlay);
      videoElm.removeEventListener('pause', handlePause);
    };
  }, [$video.current]);

  return <video src={videoUrl} ref={$video}/>;
};

export default memo(VideoWrap, () => true);
