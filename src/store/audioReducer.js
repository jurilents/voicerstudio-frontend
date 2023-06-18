const ADD_AUDIO = 'ADD_AUDIO';
const REMOVE_AUDIO = 'REMOVE_AUDIO';
const PLAY_AUDIO = 'PLAY_AUDIO';

const defaultState = {
  players: [],
};

export default function audioReducer(state = defaultState, action) {
  switch (action.type) {
    case ADD_AUDIO: {
      if (!Array.isArray(action.payload)) {
        action.payload = [action.payload];
      }
      const currentUrls = state.players.map(x => x.url);
      const audioToAdd = action.payload.filter(x => !(x in currentUrls));
      const newPlayers = audioToAdd.map(url => ({ url, playing: false }));
      return {
        ...state,
        players: [...state.players, ...newPlayers],
      };
    }

    case REMOVE_AUDIO: {
      if (!Array.isArray(action.payload)) {
        action.payload = [action.payload];
      }
      return {
        ...state,
        players: state.players.filter(x => !(x.url in action.payload)),
      };
    }

    case PLAY_AUDIO: {
      if (!state.players || state.players.length === 0) {
        return state;
      }
      const currentIndex = state.players.findIndex(x => x.playing === true);
      const targetIndex = state.players.findIndex(x => x.url === action.payload.url);
      if (currentIndex !== -1 && state.players[currentIndex].url !== action.payload.url) {
        state.players[currentIndex].playing = false;
        state.players[targetIndex].playing = action.payload.play !== false;
      } else if (currentIndex !== -1) {
        state.players[targetIndex].playing = action.payload.play === false;
      } else {
        state.players[targetIndex].playing = action.payload.play !== false;
      }
      return { ...state };
    }
    default:
      return state;
  }
}

export const addAudio = (urls) => ({ type: ADD_AUDIO, payload: urls });
export const removeAudio = (urls) => ({ type: REMOVE_AUDIO, payload: urls });
export const playAudio = (url, play = true) => ({ type: PLAY_AUDIO, payload: { url, play } });
