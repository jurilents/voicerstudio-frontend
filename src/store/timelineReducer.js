const SET_PLAYING = 'SET_PLAYING';
const SET_RECORDING_SUB = 'SET_RECORDING_SUB';
const RECORD_SUB = 'RECORD_SUB';
const SET_TIME = 'SET_TIME';
const SET_TOTAL_TIME = 'SET_TOTAL_TIME';
const SET_SCALE = 'SET_SCALE';

const defaultState = {
  playing: false,
  recordingSub: null,
  time: 0,
  totalTime: 60,
  scale: 5,
  scaleWidth: 160,
};

window.currentTime = defaultState.time;

export default function timelineReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_PLAYING: {
      return {
        ...state,
        playing: !!action.payload,
      };
    }
    case SET_RECORDING_SUB: {
      return {
        ...state,
        recordingSub: action.payload,
      };
    }
    case RECORD_SUB: {
      return {
        ...state,
        // recordingSub: action.payload.sub,
      };
    }
    case SET_TIME: {
      if (isNaN(action.payload)) {
        throw new Error(`Invalid time provided: ${action.payload}`);
      }
      window.currentTime = action.payload;
      return {
        ...state,
        time: action.payload,
      };
    }
    case SET_TOTAL_TIME: {
      if (isNaN(action.payload)) {
        throw new Error(`Invalid time provided: ${action.payload}`);
      }
      return {
        ...state,
        totalTime: action.payload,
      };
    }
    case SET_SCALE: {
      return {
        ...state,
        scale: action.payload.scale,
        scaleWidth: action.payload.scaleWidth,
      };
    }
    default:
      return state;
  }
}

export const setPlaying = (play) => ({ type: SET_PLAYING, payload: play });
export const setRecordingSub = (sub) => ({ type: SET_RECORDING_SUB, payload: sub });
export const recordSub = (sub, end) => ({ type: RECORD_SUB, payload: { sub, end } });
export const setTotalTime = (time) => ({ type: SET_TOTAL_TIME, payload: time });
export const setTime = (time) => ({ type: SET_TIME, payload: time });
export const setScale = (scale, scaleWidth) => ({ type: SET_SCALE, payload: { scale, scaleWidth } });
