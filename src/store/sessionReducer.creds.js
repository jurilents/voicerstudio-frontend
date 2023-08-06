import { Creds } from '../models';

const credsReducer = {
  addCreds: (state, action) => {
    const service = action.payload.cred.service;
    const selected = state.selectedCredentials[service];
    if (!selected) {
      state.selectedCredentials[service] = action.payload.cred;
    }
    return {
      ...state,
      selectedCredentials: { ...state.selectedCredentials },
      credentials: [...state.credentials, action.payload.cred],
    };
  },
  removeCreds: (state, action) => {
    return {
      ...state,
      credentials: state.credentials.filter(x => x !== action.payload.cred),
    };
  },
  patchCreds: (state, action) => {
    const index = state.credentials.findIndex(x => x.value === action.payload.cred.value);
    if (index < 0) return;
    const credsCopy = [...state.credentials];
    const cred = state.credentials[index];
    credsCopy[index] = new Creds({ ...cred, ...action.payload.patch });
    return {
      ...state,
      credentials: credsCopy,
    };
  },
  selectCreds: (state, action) => {
    const selectedCredentials = { ...state.selectedCredentials };
    selectedCredentials[action.payload.service] = action.payload.cred;
    return {
      ...state,
      selectedCredentials: selectedCredentials,
    };
  },
};

export default credsReducer;
