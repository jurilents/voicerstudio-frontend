import { Speaker, Sub } from '../models';
import colors from '../utils/colors';
import speakersReducer from './sessionReducer.speakers';
import subsReducer from './sessionReducer.subs';
import presetsReducer from './sessionReducer.presets';

// Commands
const ADD_SPEAKER = 'ADD_SPEAKER';
const REMOVE_SPEAKER = 'REMOVE_SPEAKER';
const PATCH_SPEAKER = 'PATCH_SPEAKER';
const SELECT_SPEAKER = 'SELECT_SPEAKER';

const SET_ALL_SPEAKER_SUBS = 'SET_ALL_SPEAKER_SUBS';
const ADD_SPEAKER_SUB = 'ADD_SPEAKER_SUB';
const REMOVE_SPEAKER_SUB = 'REMOVE_SPEAKER_SUB';
const PATCH_SPEAKER_SUB = 'PATCH_SPEAKER_SUB';
const SELECT_SPEAKER_SUB = 'SELECT_SPEAKER_SUB';

const ADD_PRESET = 'ADD_PRESET';
const REMOVE_PRESET = 'REMOVE_PRESET';
const PATCH_PRESET = 'PATCH_PRESET';

const SET_VIDEO = 'SET_VIDEO';

// Storage keys
const STORAGE_KEY = 'session';

// Default state
const defaultSpeaker = new Speaker({ id: 1, displayName: 'Speaker 1', color: colors.blue });
const rootState = {
  speakers: [defaultSpeaker],
  selectedSpeaker: defaultSpeaker,
  selectedSub: null,
  presets: [],
  videoUrl: null,
  subsHistory: [],
};

function parseSessionJson(json) {
  const obj = JSON.parse(json);
  if (obj.speakers && Array.isArray(obj.speakers)) {
    obj.speakers = obj.speakers.map(speaker => {
      if (speaker?.subs && Array.isArray(speaker.subs)) {
        speaker.subs = speaker.subs.map(sub => new Sub(sub));
      }
      return new Speaker(speaker);
    });
  }
  if (obj.selectedSpeaker?.id) {
    obj.selectedSpeaker = obj.speakers.find(x => x.id === obj.selectedSpeaker.id);
  }
  if (!obj.selectedSpeaker && obj.speakers?.length) {
    obj.selectedSpeaker = obj.speakers[0];
  }
  if (obj.selectedSub?.id) {
    obj.selectedSub = obj.selectedSpeaker.subs.find(x => x.id === obj.selectedSub.id);
    console.log('obj.selectedSub', obj.selectedSub);
  }
  if (!obj.selectedSub && obj.selectedSpeaker?.subs?.length) {
    obj.selectedSub = obj.selectedSpeaker.subs[0];
  }
  return obj;
}

const storedState = localStorage.getItem(STORAGE_KEY);
const defaultState = storedState ? { ...rootState, ...parseSessionJson(storedState) } : rootState;

function saveToLocalStorage(session) {
  const sessionCopy = { ...session };
  delete sessionCopy.subsHistory;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionCopy));
  return session;
}

export default function sessionReducer(state = defaultState, action) {
  switch (action.type) {
    /************************* SPEAKERS *************************/
    case ADD_SPEAKER: {
      const session = speakersReducer.addSpeaker(state, action);
      return saveToLocalStorage(session);
    }
    case REMOVE_SPEAKER: {
      const session = speakersReducer.removeSpeaker(state, action);
      return saveToLocalStorage(session);
    }
    case PATCH_SPEAKER: {
      const session = speakersReducer.patchSpeaker(state, action);
      return saveToLocalStorage(session);
    }
    case SELECT_SPEAKER: {
      const session = speakersReducer.selectSpeaker(state, action);
      return saveToLocalStorage(session);
    }

    /************************* SPEAKER SUBS *************************/
    case SET_ALL_SPEAKER_SUBS: {
      const session = subsReducer.setAllSubs(state, action);
      return saveToLocalStorage(session);
    }
    case ADD_SPEAKER_SUB: {
      const session = subsReducer.addSub(state, action);
      return saveToLocalStorage(session);
    }
    case REMOVE_SPEAKER_SUB: {
      const session = subsReducer.removeSub(state, action);
      return saveToLocalStorage(session);
    }
    case PATCH_SPEAKER_SUB: {
      const session = subsReducer.patchSub(state, action);
      return saveToLocalStorage(session);
    }
    case SELECT_SPEAKER_SUB: {
      const session = subsReducer.selectSub(state, action);
      return saveToLocalStorage(session);
    }

    /************************* PRESETS *************************/
    case ADD_PRESET: {
      const session = presetsReducer.addPreset(state, action);
      return saveToLocalStorage(session);
    }

    case REMOVE_PRESET: {
      const session = presetsReducer.removePreset(state, action);
      return saveToLocalStorage(session);
    }

    case PATCH_PRESET: {
      const session = presetsReducer.patchPreset(state, action);
      return saveToLocalStorage(session);
    }

    /************************* VIDEO *************************/
    case SET_VIDEO: {
      const session = {
        ...state,
        videoUrl: action.payload.videoUrl,
      };
      return saveToLocalStorage(session);
    }

    default:
      return state;
  }
}

export const addSpeaker = (speaker) => ({ type: ADD_SPEAKER, payload: { speaker } });
export const removeSpeaker = (id) => ({ type: REMOVE_SPEAKER, payload: { id } });
export const patchSpeaker = (id, patch) => ({ type: PATCH_SPEAKER, payload: { id, patch } });
export const selectSpeaker = (id) => ({ type: SELECT_SPEAKER, payload: { id } });

export const setAllSubs = (speakerId, subs) => ({ type: ADD_SPEAKER_SUB, payload: { speakerId, subs } });
export const addSub = (sub) => ({ type: ADD_SPEAKER_SUB, payload: { sub } });
export const removeSub = (sub) => ({ type: REMOVE_SPEAKER_SUB, payload: { sub } });
export const patchSub = (sub, patch) => ({ type: PATCH_SPEAKER_SUB, payload: { sub, patch } });
export const selectSub = (sub) => ({ type: SELECT_SPEAKER_SUB, payload: { sub } });

export const addPreset = (preset) => ({ type: ADD_PRESET, payload: { preset } });
export const removePreset = (id) => ({ type: REMOVE_PRESET, payload: { id } });
export const patchPreset = (id, patch) => ({ type: PATCH_PRESET, payload: { id, patch } });

export const setVideo = (videoUrl) => ({ type: SET_VIDEO, payload: { videoUrl } });
