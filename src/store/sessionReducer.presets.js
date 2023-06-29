import { Preset } from '../models';

const presetsReducer = {
  addPreset: (state, action) => {
    const session = {
      ...state,
      presets: [...state.presets, action.payload.preset],
    };

    return session;
  },
  removePreset: (state, action) => {
    const session = {
      ...state,
      presets: state.presets.filter(x => x.id !== action.payload.id),
    };

    return session;
  },
  patchPreset: (state, action) => {
    const index = state.presets.findIndex(x => x.id === action.payload.id);
    if (index < 0) return;
    const presetsCopy = [...state.presets];
    const presets = state.presets[index];
    presetsCopy[index] = new Preset({ ...presets, ...action.payload.patch });
    return {
      ...state,
      presets: presetsCopy,
    };
  },
};

export default presetsReducer;
