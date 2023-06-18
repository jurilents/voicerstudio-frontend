import React, { createRef, memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { playAudio } from '../../store/audioReducer';

export const AudioWrap = memo(({}) => {
  const dispatch = useDispatch();
  const playingAudio = useSelector(store => store.audio.players.find(x => x.playing === true));
  const $audio = createRef();
  // const $audioSource = createRef();
  console.log('playingAudio', playingAudio);

  useEffect(() => {
    if (playingAudio) {
      $audio.current.src = playingAudio.url;
      $audio.current.play();
      const onEnd = () => {
        playingAudio.playing = false;
        dispatch(playAudio(playingAudio.url, false));
      };
      $audio.current.addEventListener('ended', onEnd);
      return () => {
        if ($audio.current) {
          $audio.current.removeEventListener('ended', onEnd);
        }
      };
    }
  }, [$audio, playingAudio]);

  return <audio ref={$audio}>
    {/*<source ref={$audioSource} type='audio/wav' />*/}
  </audio>;
}, () => true);
