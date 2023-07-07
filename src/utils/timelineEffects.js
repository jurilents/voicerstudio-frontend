import audioController from './AudioController';

export const effectKeys = {
  audioTrack: 'audio-track',
};

export const timelineEffects = {
  audioTrack: {
    id: effectKeys.audioTrack,
    name: effectKeys.audioTrack,
    source: {
      start: ({ action, engine, isPlaying, time }) => {
        console.log('start effect 0');
        if (isPlaying) {
          const src = action.audioUrl;
          audioController.start({
            id: src,
            src,
            startTime: action.start,
            engine,
            time,
          });
        }
      },
      enter: ({ action, engine, isPlaying, time }) => {
        if (isPlaying) {
          console.log('enter effect 0');
          const src = action.audioUrl;
          audioController.start({
            id: src,
            src,
            startTime: action.start,
            engine,
            time,
          });
        }
      },
      leave: ({ action, engine }) => {
        console.log('leave effect 0');
        const src = action.audioUrl;
        audioController.stop({
          id: src,
          engine,
        });
      },
      stop: ({ action, engine }) => {
        console.log('stop effect 0');
        const src = action.audioUrl;
        audioController.stop({
          id: src,
          engine,
        });
      },
    },
  },
};
