import { Sub } from '../models';

const subsReducer = {
  setAllSubs: (state, action) => {
    const speaker = state.speakers[action.payload.speakerId];
    speaker.subs = action.payload.subs;
    return { ...state };
  },
  addSub: (state, action) => {
    const speaker = state.speakers.find(x => x.id === action.payload.sub.speakerId);
    if (!speaker) {
      throw new Error('Cannot add subs to undefined speaker.');
    }
    speaker.subs = [...(speaker.subs || []), action.payload.sub];
    const session = { ...state };
    session.selectedSub = action.payload.sub;
    return session;
  },
  removeSub: (state, action) => {
    const speaker = state.speakers.find(x => x.id === action.payload.sub.speakerId);
    if (!speaker) {
      throw new Error('Cannot remove subs of undefined speaker.');
    }
    speaker.subs = speaker.subs.filter(x => x.id !== action.payload.sub.id);
    return { ...state, selectedSub: null };
  },
  patchSub: (state, action) => {
    const speaker = state.speakers.find(x => x.id === action.payload.sub.speakerId);
    if (!speaker) {
      throw new Error('Cannot remove subs of undefined speaker.');
    }
    speaker.subs = [...(speaker.subs || [])];
    const subIndex = speaker.subs.findIndex(x => x.id === action.payload.sub.id);
    if (subIndex === -1) {
      return;
    }
    const sub = speaker.subs[subIndex];
    speaker.subs[subIndex] = new Sub({ ...sub, ...action.payload.patch });
    return { ...state };
  },
  selectSub: (state, action) => {
    let speaker = state.speakers.find(x => x.id === action.payload.sub.speakerId);
    if (!speaker) {
      throw new Error('Cannot remove subs of undefined speaker.');
    }
    if (!state.selectedSpeaker || state.selectedSpeaker.id !== action.payload.sub.speakerId) {
      speaker = state.speakers.find(x => x.id === action.payload.sub.speakerId);
    }
    return {
      ...state,
      selectedSpeaker: speaker,
      selectedSub: action.payload.sub,
    };
  },
};

export default subsReducer;
