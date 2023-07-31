import audioController from './AudioController';

export const effectKeys = {
  audioTrack: 'audioTrack',
};

function getSpeakerVolume(action) {
  const vol = (window.speakersVolume?.[action.speakerId] || 1) * (window.masterVolume || 1);
  console.log('speaker volume', vol);
  return vol;
}

export const timelineEffects = {
  audioTrack: {
    id: effectKeys.audioTrack,
    name: effectKeys.audioTrack,
    source: {
      start: ({ action, engine, isPlaying, time }) => {
        if (isPlaying) {
          // console.log('start effect 0', action.data?.src);
          const src = action.data?.src;
          if (!action.data?.src) return;
          audioController.start({
            id: action.id,
            src,
            startTime: action.start,
            time,
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
            src,
            startTime: action.start,
            time,
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
          engine,
        });
      },
      stop: ({ action, engine }) => {
        // console.log('stop effect 0', action.data?.src);
        const src = action.data?.src;
        if (!action.data?.src) return;
        audioController.stop({
          id: action.id,
          engine,
        });
      },
    },
  },
};
