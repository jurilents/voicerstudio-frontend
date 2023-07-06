const SET_PLAYING = 'SET_PLAYING';
const SET_RECORDING = 'SET_RECORDING';
const SET_TIME = 'SET_TIME';

const defaultState = {
  playing: false,
  recording: false,
  time: 0,
};

export default function timelineReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_PLAYING: {
      return {
        ...state,
        playing: !!action.payload,
      };
    }
    case SET_RECORDING: {
      return {
        ...state,
        recording: !!action.payload,
      };
    }
    case SET_TIME: {
      if (isNaN(action.payload)) {
        throw new Error(`Invalid time provided: ${action.payload}`);
      }
      return {
        ...state,
        time: action.payload,
      };
    }
    default:
      return state;
  }
}

export const setPlaying = (play) => ({ type: SET_PLAYING, payload: play });
export const setRecording = (record) => ({ type: SET_RECORDING, payload: record });
export const setTime = (time) => ({ type: SET_TIME, payload: time });
