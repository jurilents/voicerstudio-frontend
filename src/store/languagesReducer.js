const SET_AZURE_LANGUAGES = 'SET_AZURE_LANGUAGES';
const SET_VM_LANGUAGES = 'SET_VM_LANGUAGES';

const STORAGE_KEY = 'languages';

const rootState = {
    azure: [],
    voiceMaker: [],
};

const storedState = localStorage.getItem(STORAGE_KEY);
const defaultState = storedState ? { ...rootState, ...JSON.parse(storedState) } : rootState;

export default function languagesReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_AZURE_LANGUAGES: {
            const newLanguages = {
                ...state,
                azure: action.payload,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newLanguages));
            return newLanguages;
        }

        case SET_VM_LANGUAGES: {
            const newLanguages = {
                ...state,
                voiceMaker: action.payload,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newLanguages));
            return newLanguages;
        }

        default:
            return state;
    }
}

export const setAzureLanguages = (langs) => ({ type: SET_AZURE_LANGUAGES, payload: langs });
export const setVMLanguages = (langs) => ({ type: SET_VM_LANGUAGES, payload: langs });

// export const selectLanguages = createSelector(
//   [state => state.languages],
//   (languages) => languages || [],
// );
