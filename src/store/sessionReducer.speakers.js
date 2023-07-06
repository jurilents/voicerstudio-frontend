import { Speaker } from '../models';

const speakersReducer = {
  addSpeaker: (state, action) => {
    // Limit 10 speakers
    if (state.speakers.length >= 10) {
      return state;
    }
    const session = {
      ...state,
      speakers: [...state.speakers, action.payload.speaker],
    };
    if (!state.selectedSpeaker) {
      session.selectedSpeaker = session.speakers[0];
    }
    return session;
  },
  removeSpeaker: (state, action) => {
    if (state.speakers.length < 2) {
      return state;
    }
    const session = {
      ...state,
      speakers: state.speakers.filter(x => x.id !== action.payload.id),
    };
    if (state.selectedSpeaker && state.selectedSpeaker.id === action.payload.id) {
      session.selectedSpeaker = session.speakers?.length ? session.speakers[0] : null;
    }
    return session;
  },
  patchSpeaker: (state, action) => {
    const index = state.speakers.findIndex(x => x.id === action.payload.id);
    if (index < 0) return;
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
