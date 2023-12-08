import audioController from './AudioController';

const effectKeys = {
  audioTrack: 'audioTrack',
};

function getSpeakerVolume(action) {
  let speakerVol = window.speakersData?.[action.speakerId].volume;
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

function playSubAudio({action, engine, isPlaying, time}) {
  if (isPlaying) {
    if (!action.data?.src) return;
    const speakerSpeed = window.speakersData?.[action.speakerId].speed || 0;

    audioController.start({
      id: action.id,
      speakerId: action.speakerId,
      src: action.data?.src,
      startTime: action.start,
      time,
      speedRate: invertRate(action.speedRate) + speakerSpeed,
      volume: getSpeakerVolume(action),
      engine,
    });
  }
}

function pauseSubAudio({action, engine}) {
  if (!action.data?.src) return;
  audioController.stop({
    id: action.id,
    speakerId: action.speakerId,
    engine,
  });
}

const timelineEffects = {
  audioTrack: {
    id: effectKeys.audioTrack,
    name: effectKeys.audioTrack,
    source: {
      start: playSubAudio,
      enter: playSubAudio,
      leave: (params) => {
        if (!params.isPlaying) return;
        pauseSubAudio(params);
      },
      stop: pauseSubAudio,
    },
  },
};

export {effectKeys, timelineEffects, audioController};
