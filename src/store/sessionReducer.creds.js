import { Creds } from '../models';

const credsReducer = {
  addCreds: (state, action) => {
    return {
      ...state,
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
    console.log('pccc', index);
    if (index < 0) return;
    const credsCopy = [...state.credentials];
    const cred = state.credentials[index];
    credsCopy[index] = new Creds({ ...cred, ...action.payload.patch });
    return {
      ...state,
      credentials: credsCopy,
    };
  },
};

export default credsReducer;
