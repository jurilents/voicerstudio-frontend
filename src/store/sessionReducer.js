import { Speaker } from '../models';
import colors from '../utils/colors';

// Commands
const ADD_SPEAKER = 'ADD_SPEAKER';
const REMOVE_SPEAKER = 'REMOVE_SPEAKER';
const PATCH_SPEAKER = 'PATCH_SPEAKER';
const SELECT_SPEAKER = 'PATCH_SPEAKER';

// Storage keys
const STORAGE_KEY = 'session';

// Default state
const defaultSpeaker = new Speaker({ id: 1, name: 'Speaker 1', color: colors.blue });
const rootState = {
  speakers: [defaultSpeaker],
  selectedSpeaker: defaultSpeaker,
  subs: [],
  selectedSub: null,
};

const storedState = localStorage.getItem(STORAGE_KEY);
const defaultState = storedState ? { ...rootState, ...JSON.parse(storedState) } : rootState;

export default function sessionReducer(state = defaultState, action) {
  switch (action.type) {
    case ADD_SPEAKER: {
      const newSpeakers = {
        ...state,
        speakers: [...state.speakers, action.payload.speaker],
      };
      if (!state.selectedSpeaker) {
        newSpeakers.selectedSpeaker = newSpeakers.data[0];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSpeakers));
      return newSpeakers;
    }

    case REMOVE_SPEAKER: {
      if (state.speakers.length < 2) {
        return state;
      }
      const newSpeakers = {
        ...state,
        speakers: state.speakers.filter(x => x.id !== action.payload.id),
      };
      if (state.selectedSpeaker && state.selectedSpeaker.id === action.payload.id) {
        newSpeakers.selectedSpeaker = state.speakers?.length ? state.speakers[0] : null;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSpeakers));
      return newSpeakers;
    }

    case PATCH_SPEAKER: {
      const index = state.speakers.findIndex(x => x.id === action.payload.id);
      if (index < 0) return;
      const speakersCopy = [...state.speakers];
      const speaker = state.speakers[index];
      speakersCopy[index] = new Speaker({ ...speaker, ...action.payload.patch });
      const newSpeakers = {
        ...state,
        speakers: speakersCopy,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSpeakers));
      return newSpeakers;
    }

    case SELECT_SPEAKER: {
      const selectedSpeaker = state.speakers.find(x => x.id === action.payload.id);
      const newSpeakers = {
        ...state,
        selectedSpeaker: selectedSpeaker,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSpeakers));
      return newSpeakers;
    }

    default:
      return state;
  }
}

export const addSpeaker = (speaker) => ({ type: ADD_SPEAKER, payload: { speaker } });
export const removeSpeaker = (id) => ({ type: REMOVE_SPEAKER, payload: { id } });
export const patchSpeaker = (id, patch) => ({ type: PATCH_SPEAKER, payload: { id, patch } });
export const selectSpeaker = (id) => ({ type: SELECT_SPEAKER, payload: { id } });
