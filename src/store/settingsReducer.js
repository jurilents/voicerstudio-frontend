import isEqual from 'lodash/isEqual';

const SET_SETTINGS = 'SET_SETTINGS';

const defaultState = {
  selectedSpeaker: null,
  selectedSubtitle: null,
  // If true, allows user to draw new subs, otherwise dragging will scroll
  drawingMode: true,
  //
  scrollableMode: true,
  //
  magnetMode: true,
  timelineZoom: 1,
  //
  playbackSpeed: 1,
  // From 0 (mute) to 1 (100%)
  audioVolume: 1,
  exportFormat: 'WAV',
  exportCodec: 'Riff8Khz16BitMonoPcm',
};

export default function settingsReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_SETTINGS: {
      const newSettings = { ...state, ...action.payload };
      if (!isEqual(newSettings, state)) {
        window.localStorage.setItem('settings', JSON.stringify(newSettings));
        return newSettings;
      }
      return state;
    }
    default:
      return state;
  }
}

export const setSettings = (patch) => ({ type: SET_SETTINGS, payload: patch });
