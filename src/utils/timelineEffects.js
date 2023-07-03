import audioController from './AudioController';

export const effectKeys = {
  audioTrack: 'audio-track',
};

export const timelineEffects = {
  audioTrack: {
    id: effectKeys.audioTrack,
    name: '播放音效',
    source: {
      start: ({ action, engine, isPlaying, time }) => {
        if (isPlaying) {
          const src = action.data.src;
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
          const src = action.data.src;
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
        const src = action.data.src;
        audioController.stop({
          id: src,
          engine,
        });
      },
      stop: ({ action, engine }) => {
        const src = action.data.src;
        audioController.stop({
          id: src,
          engine,
        });
      },
    },
  },
};
