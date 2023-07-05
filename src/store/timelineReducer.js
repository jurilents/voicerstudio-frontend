const SET_PLAYING = 'SET_PLAYING';
const SET_TIME = 'SET_TIME';

const defaultState = {
  playing: false,
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
export const setTime = (time) => ({ type: SET_TIME, payload: time });
