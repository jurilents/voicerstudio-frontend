const SET_LANGUAGES = 'SET_LANGUAGES';

const STORAGE_KEY = 'languages';

const rootState = {
  languages: [],
};

const storedState = localStorage.getItem(STORAGE_KEY);
const defaultState = storedState ? { ...rootState, ...JSON.parse(storedState) } : rootState;

export default function languagesReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_LANGUAGES: {
      const newLanguages = {
        ...state,
        languages: action.payload,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLanguages));
      return newLanguages;
    }
    default:
      return state;
  }
}

export const setLanguages = (langs) => ({ type: SET_LANGUAGES, payload: langs });
