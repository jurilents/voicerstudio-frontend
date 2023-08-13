import { Speaker, Sub, VoicedStatuses } from '../models';
import colors from '../utils/colors';
import speakersReducer, { setGlobalSpeakerVolume } from './sessionReducer.speakers';
import subsReducer from './sessionReducer.subs';
import presetsReducer from './sessionReducer.presets';
import timeMachine from '../utils/TimeMachine';
import { cloneByKeys, objectsHaveSameKeys } from '../utils';
import credsReducer from './sessionReducer.creds';
import markersReducer from './sessionReducer.markers';

// Commands
const RESTORE_FROM_JSON = 'RESTORE_FROM_JSON';

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
const SET_VIDEO_DURATION = 'SET_VIDEO_DURATION';

const ADD_CREDS = 'ADD_CREDS';
const REMOVE_CREDS = 'REMOVE_CREDS';
const PATCH_CREDS = 'PATCH_CREDS';
const SELECT_CREDS = 'SELECT_CREDS';

const SET_MARKER = 'SET_MARKER';
const PATCH_MARKER = 'PATCH_MARKER';

// Storage keys
const STORAGE_KEY = 'session';

// Default state
const defaultSpeaker = new Speaker({
  id: 1,
  displayName: 'Speaker 1',
  color: colors.teal,
});
const rootState = {
  speakers: [defaultSpeaker],
  selectedSpeaker: defaultSpeaker,
  selectedSub: null,
  credentials: [],
  selectedCredentials: { Azure: null },
  presets: [],
  markers: [],
  videoUrl: null,
  videoDuration: 60,
};

function parseSessionJson(json) {
  const obj = JSON.parse(json);
  if (obj.speakers && Array.isArray(obj.speakers)) {
    obj.speakers = obj.speakers.map((speaker) => {
      if (speaker?.subs && Array.isArray(speaker.subs)) {
        speaker.subs = speaker.subs.map(sub => {
          if (sub.data === VoicedStatuses.processing) {
            sub.data = null;
          }
          if (sub.data?.src) {
            sub.data.src = VoicedStatuses.voiced;
          }
          return new Sub(sub);
        });
      }
      setGlobalSpeakerVolume(speaker.id, speaker.volume, speaker.mute);
      return new Speaker(speaker);
    });
  }
  if (obj.selectedSpeaker?.id) {
    obj.selectedSpeaker = obj.speakers.find(x => x.id === obj.selectedSpeaker.id);
  }
  if (!obj.selectedSpeaker && obj.speakers?.length) {
    obj.selectedSpeaker = obj.speakers[0];
  }
  if (obj.selectedSpeaker) {
    if (obj.selectedSub?.id) {
      obj.selectedSub = obj.selectedSpeaker.subs.find(x => x.id === obj.selectedSub.id);
    }
    if (!obj.selectedSub && obj.selectedSpeaker?.subs?.length) {
      obj.selectedSub = obj.selectedSpeaker.subs[0];
    }
  }
  if (obj.videoUrl) {
    obj.videoUrl = VoicedStatuses.processing;
  }
  if (!obj.markers) {
    obj.markers = [];
  }
  return obj;
}

const storedState = localStorage.getItem(STORAGE_KEY);
const defaultState = storedState ? { ...rootState, ...parseSessionJson(storedState) } : rootState;

function saveToLocalStorage(session) {
  const sessionCopy = { ...session };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionCopy));
  return session;
}


function pushSpeakerPatchToHistory(state, action) {
  const lastChange = timeMachine.getLast();
  const speaker = state.speakers.find(x => x.id === action.payload.id);
  if (lastChange?.undo.type === PATCH_SPEAKER
    && lastChange.undo.payload.id === action.payload.id
    && objectsHaveSameKeys(lastChange.undo.payload.patch, action.payload.patch)) {
    lastChange.undo.patch = cloneByKeys(speaker, Object.keys(action.payload.patch));
  } else {
    const patch = cloneByKeys(speaker, Object.keys(action.payload.patch));
    timeMachine.push(action, patchSpeaker(action.payload.id, patch));
  }
}

function pushSubPatchToHistory(state, action) {
  const lastChange = timeMachine.getLast();
  if (lastChange?.undo.type === PATCH_SPEAKER_SUB
    && lastChange.undo.payload.id === action.payload.id
    && objectsHaveSameKeys(lastChange.undo.payload.patch, action.payload.patch)) {
    lastChange.redo.payload.patch = action.payload.patch;
  } else {
    const patch = cloneByKeys(action.payload.sub, Object.keys(action.payload.patch));
    const undoAction = patchSub(action.payload.sub, patch);
    timeMachine.push(action, undoAction);
  }
}

export default function sessionReducer(state = defaultState, action) {
  switch (action.type) {
    /************************* BACKUP *************************/
    case RESTORE_FROM_JSON: {
      const session = parseSessionJson(action.payload.jsonText);
      saveToLocalStorage(session);
      window.location.reload();
      return state;
    }

    /************************* SPEAKERS *************************/
    case ADD_SPEAKER: {
      timeMachine.push(action, removeSpeaker(action.payload.speaker));
      const session = speakersReducer.addSpeaker(state, action);
      return saveToLocalStorage(session);
    }
    case REMOVE_SPEAKER: {
      timeMachine.push(action, addSpeaker(action.payload.speaker));
      const session = speakersReducer.removeSpeaker(state, action);
      return saveToLocalStorage(session);
    }
    case PATCH_SPEAKER: {
      pushSpeakerPatchToHistory(state, action);
      const session = speakersReducer.patchSpeaker(state, action);
      return saveToLocalStorage(session);
    }
    case SELECT_SPEAKER: {
      // timeMachine.push(action, selectSpeaker(state.selectedSpeaker?.id));
      const session = speakersReducer.selectSpeaker(state, action);
      return saveToLocalStorage(session);
    }

    /************************* SPEAKER SUBS *************************/
    case SET_ALL_SPEAKER_SUBS: {
      const session = subsReducer.setAllSubs(state, action);
      return saveToLocalStorage(session);
    }
    case ADD_SPEAKER_SUB: {
      timeMachine.push(action, removeSub(action.payload.sub));
      const session = subsReducer.addSub(state, action);
      return saveToLocalStorage(session);
    }
    case REMOVE_SPEAKER_SUB: {
      timeMachine.push(action, addSub(action.payload.sub));
      const session = subsReducer.removeSub(state, action);
      return saveToLocalStorage(session);
    }
    case PATCH_SPEAKER_SUB: {
      pushSubPatchToHistory(state, action);
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
        speakers: [...state.speakers],
        videoUrl: action.payload.videoUrl,
      };
      return saveToLocalStorage(session);
    }
    case SET_VIDEO_DURATION: {
      if (isNaN(+action.payload.videoDuration)) {
        throw new Error(`Invalid duration provided: '${action.payload.videoDuration}'`);
      }
      const session = {
        ...state,
        videoDuration: +action.payload.videoDuration,
      };
      return saveToLocalStorage(session);
    }

    /************************* CREDENTIALS *************************/
    case ADD_CREDS: {
      const session = credsReducer.addCreds(state, action);
      return saveToLocalStorage(session);
    }
    case REMOVE_CREDS: {
      const session = credsReducer.removeCreds(state, action);
      return saveToLocalStorage(session);
    }
    case PATCH_CREDS: {
      const session = credsReducer.patchCreds(state, action);
      return saveToLocalStorage(session);
    }
    case SELECT_CREDS: {
      const session = credsReducer.selectCreds(state, action);
      return saveToLocalStorage(session);
    }


    /************************* MARKERS *************************/
    case SET_MARKER: {
      const session = markersReducer.setMarker(state, action);
      return saveToLocalStorage(session);
    }
    case PATCH_MARKER: {
      const session = markersReducer.patchMarker(state, action);
      return saveToLocalStorage(session);
    }

    default:
      return state;
  }
}

export const restoreFromJson = (jsonText) => ({ type: RESTORE_FROM_JSON, payload: { jsonText } });

export const addSpeaker = (speaker) => ({ type: ADD_SPEAKER, payload: { speaker } });
export const removeSpeaker = (speaker) => ({ type: REMOVE_SPEAKER, payload: { speaker } });
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
export const setVideoDuration = (videoDuration) => ({ type: SET_VIDEO_DURATION, payload: { videoDuration } });

export const addCreds = (cred) => ({ type: ADD_CREDS, payload: { cred } });
export const removeCreds = (cred) => ({ type: REMOVE_CREDS, payload: { cred } });
export const patchCreds = (cred, patch) => ({ type: PATCH_CREDS, payload: { cred, patch } });
export const selectCreds = (cred, service) => ({ type: SELECT_CREDS, payload: { cred, service } });

export const setMarker = (marker) => ({ type: SET_MARKER, payload: { marker } });
export const patchMarker = (marker, patch) => ({ type: PATCH_MARKER, payload: { marker, patch } });
