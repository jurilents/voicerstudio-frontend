import { Speaker } from '../models';
import { settings } from '../settings';
import audioController from '../utils/AudioController';


export function setGlobalSpeakerVolume(speakerId, volume) {
  if (isNaN(+volume)) return;
  if (window.speakersVolume) {
    window.speakersVolume[speakerId] = volume;
  } else {
    window.speakersVolume = { [speakerId]: volume };
  }

  audioController.setSpeakerVolume({ speakerId, volume });
}

const speakersReducer = {
  addSpeaker: (state, action) => {
    // Limit 10 speakers
    if (state.speakers.length >= settings.speakersLimit) {
      return state;
    }
    const session = {
      ...state,
      speakers: [...state.speakers, action.payload.speaker],
    };
    if (!state.selectedSpeaker) {
      session.selectedSpeaker = session.speakers[0];
    }
    setGlobalSpeakerVolume(action.payload.speaker.id, action.payload.speaker.volume || 1);
    return session;
  },
  removeSpeaker: (state, action) => {
    if (state.speakers.length < 2) {
      return state;
    }
    const session = {
      ...state,
      speakers: state.speakers.filter(x => x.id !== action.payload.speaker.id),
    };
    if (state.selectedSpeaker && state.selectedSpeaker.id === action.payload.speaker.id) {
      session.selectedSpeaker = session.speakers?.length ? session.speakers[0] : null;
    }
    return session;
  },
  patchSpeaker: (state, action) => {
    const index = state.speakers.findIndex(x => x.id === action.payload.id);
    if (index < 0) return;
    if (action.payload.patch.volume || action.payload.patch.mute) {
      const globalVolume = action.payload.patch.mute ? 0 : +action.payload.patch.volume;
      setGlobalSpeakerVolume(action.payload.id, globalVolume);
      if (Object.keys(action.payload.patch).length === 1) {
        // If only volume changes, do not change the state, only value
        const speaker = state.speakers[index];
        speaker.volume = action.payload.patch.volume;
        return state;
      }
    }
    const speakersCopy = [...state.speakers];
    const speaker = state.speakers[index];
    speakersCopy[index] = new Speaker({ ...speaker, ...action.payload.patch });
    return {
      ...state,
      speakers: speakersCopy,
      selectedSpeaker: speakersCopy[index],
    };
  },
  selectSpeaker: (state, action) => {
    let selectedSpeaker = state.speakers.find(x => x.id === action.payload.id);
    if (!selectedSpeaker) {
      selectedSpeaker = state.speakers.length ? state.speakers[0] : null;
    }
    if (state.selectedSub?.speakerId !== selectedSpeaker.id) {
      return {
        ...state,
        selectedSpeaker: selectedSpeaker,
        selectedSub: null,
      };
    }
    return {
      ...state,
      selectedSpeaker: selectedSpeaker,
    };
  },
};

export default speakersReducer;
