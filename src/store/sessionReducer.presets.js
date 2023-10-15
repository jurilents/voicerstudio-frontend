import { Preset } from '../models';

const presetsReducer = {
    addPreset: (state, action) => {
        const noPresetSpeakers = state.speakers.filter((x) => !x.preset);
        if (noPresetSpeakers.length > 0) {
            for (const speaker of noPresetSpeakers) {
                speaker.preset = action.payload.preset;
            }
        }
        return {
            ...state,
            presets: [...state.presets, action.payload.preset],
        };
    },
    removePreset: (state, action) => {
        const changeSpeakers = state.speakers.filter((x) => x.preset?.id === action.payload.id);
        const defaultPreset = state.presets?.length ? state.presets[0] : null;
        for (const changeSpeaker of changeSpeakers) {
            changeSpeaker.preset = defaultPreset;
        }
        return {
            ...state,
            presets: state.presets.filter((x) => x.id !== action.payload.id),
        };
    },
    patchPreset: (state, action) => {
        const index = state.presets.findIndex((x) => x.id === action.payload.id);
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
