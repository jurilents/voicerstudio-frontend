const SET_PLAYER = 'SET_PLAYER';

const defaultState = {
  videoPlayer: null,
};

export default function playerReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_PLAYER: {
      return {videoPlayer: action.payload};
    }

    default:
      return state;
  }
}

export const setVideoPlayer = (player) => ({type: SET_PLAYER, payload: player});
