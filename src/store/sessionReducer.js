import { Speaker } from '../models';
import colors from '../utils/colors';
import speakersReducer from './sessionReducer.speakers';
import presetsReducer from './sessionReducer.presets';

// Commands
const ADD_SPEAKER = 'ADD_SPEAKER';
const REMOVE_SPEAKER = 'REMOVE_SPEAKER';
const PATCH_SPEAKER = 'PATCH_SPEAKER';
const SELECT_SPEAKER = 'SELECT_SPEAKER';

const ADD_PRESET = 'ADD_PRESET';
const REMOVE_PRESET = 'REMOVE_PRESET';
const PATCH_PRESET = 'PATCH_PRESET';

const SET_VIDEO = 'SET_VIDEO';

// Storage keys
const STORAGE_KEY = 'session';

// Default state
const defaultSpeaker = new Speaker({ id: 1, name: 'Speaker 1', color: colors.blue });
const rootState = {
  speakers: [defaultSpeaker],
  selectedSpeaker: defaultSpeaker,
  subs: [],
  selectedSub: null,
  presets: [],
  videoUrl: null,
};

const storedState = localStorage.getItem(STORAGE_KEY);
const defaultState = storedState ? { ...rootState, ...JSON.parse(storedState) } : rootState;

export default function sessionReducer(state = defaultState, action) {
  switch (action.type) {
    /************************* SPEAKERS *************************/
    case ADD_SPEAKER: {
      const session = speakersReducer.addSpeaker(state, action);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return session;
    }
    case REMOVE_SPEAKER: {
      const session = speakersReducer.removeSpeaker(state, action);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return session;
    }
    case PATCH_SPEAKER: {
      const session = speakersReducer.patchSpeaker(state, action);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return session;
    }
    case SELECT_SPEAKER: {
      const session = speakersReducer.selectSpeaker(state, action);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return session;
    }

    /************************* PRESETS *************************/
    case ADD_PRESET: {
      const session = presetsReducer.addPreset(state, action);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return session;
    }

    case REMOVE_PRESET: {
      const session = presetsReducer.removePreset(state, action);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return session;
    }

    case PATCH_PRESET: {
      const session = presetsReducer.patchPreset(state, action);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return session;
    }

    /************************* VIDEO *************************/
    case SET_VIDEO: {
      const session = {
        ...state,
        videoUrl: action.payload.videoUrl,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return session;
    }

    default:
      return state;
  }
}

export const addSpeaker = (speaker) => ({ type: ADD_SPEAKER, payload: { speaker } });
export const removeSpeaker = (id) => ({ type: REMOVE_SPEAKER, payload: { id } });
export const patchSpeaker = (id, patch) => ({ type: PATCH_SPEAKER, payload: { id, patch } });
export const selectSpeaker = (id) => ({ type: SELECT_SPEAKER, payload: { id } });

export const addPreset = (preset) => ({ type: ADD_PRESET, payload: { preset } });
export const removePreset = (id) => ({ type: REMOVE_PRESET, payload: { id } });
export const patchPreset = (id, patch) => ({ type: PATCH_PRESET, payload: { id, patch } });

export const setVideo = (videoUrl) => ({ type: SET_VIDEO, payload: { videoUrl } });
