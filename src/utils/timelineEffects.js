import audioController from './AudioController';

const effectKeys = {
  audioTrack: 'audioTrack',
};

function getSpeakerVolume(action) {
  let speakerVol = window.speakersVolume?.[action.speakerId];
  if (isNaN(+speakerVol)) speakerVol = 1;
  if (isNaN(+window.masterVolume)) window.masterVolume = 1;
  return speakerVol * window.masterVolume;
}

function invertRate(baseRate) {
  return 1 / baseRate;
  // let acceleration = -(baseRate ?? 0) + 2;
  // if (Math.abs(acceleration) - 1 > 0.01) acceleration += acceleration * 0.01;
  // return acceleration;
}

const timelineEffects = {
  audioTrack: {
    id: effectKeys.audioTrack,
    name: effectKeys.audioTrack,
    source: {
      start: ({ action, engine, isPlaying, time }) => {
        const d = action.end - action.start;
        console.log('---duration now is', d);
        console.log('-----speed rate is', invertRate(action.speedRate));
        console.log('------approximately is', invertRate(action.speedRate) * d);
        console.log('------base duration is', action.data?.baseDuration);
        if (isPlaying) {
          // console.log('start effect 0', action.data?.src);
          const src = action.data?.src;
          if (!action.data?.src) return;
          audioController.start({
            id: action.id,
            speakerId: action.speakerId,
            src,
            startTime: action.start,
            time,
            speedRate: invertRate(action.speedRate),
            volume: getSpeakerVolume(action),
            engine,
          });
        }
      },
      enter: ({ action, engine, isPlaying, time }) => {
        if (isPlaying) {
          const src = action.data?.src;
          if (!action.data?.src) return;
          audioController.start({
            id: action.id,
            speakerId: action.speakerId,
            src,
            startTime: action.start,
            time,
            speedRate: invertRate(action.speedRate),
            volume: getSpeakerVolume(action),
            engine,
          });
        }
      },
      leave: ({ action, engine, isPlaying }) => {
        // console.log('leave effect 0', action.data?.src);
        if (!isPlaying) return;
        const src = action.data?.src;
        if (!action.data?.src) return;
        audioController.stop({
          id: action.id,
          speakerId: action.speakerId,
          engine,
        });
      },
      stop: ({ action, engine }) => {
        // console.log('stop effect 0', action.data?.src);
        const src = action.data?.src;
        if (!action.data?.src) return;
        audioController.stop({
          id: action.id,
          speakerId: action.speakerId,
          engine,
        });
      },
    },
  },
};

export { effectKeys, timelineEffects, audioController };
