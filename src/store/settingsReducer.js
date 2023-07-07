import isEqual from 'lodash/isEqual';

const SET_SETTINGS = 'SET_SETTINGS';

const STORAGE_KEY = 'settings';

const rootState = {
  selectedSpeaker: null,
  selectedSubtitle: null,
  // If true, allows user to draw new subs, otherwise dragging will scroll
  drawingMode: true,
  //
  scrollableMode: true,
  //
  magnetMode: true,
  //
  singleRecordMode: true,
  timelineZoom: 1,
  waveZoom: 1,
  //
  playbackSpeed: 1,
  // From 0 (mute) to 1 (100%)
  masterVolume: 1,
  originalVolume: 1,
  originalMute: false,
  exportFormat: 'WAV',
  exportCodec: 'Riff8Khz16BitMonoPcm',
  exportFileName: '[{L}-{s}] {d}-{t} result',
  timelineRowHeight: 50,
};

const storedState = localStorage.getItem(STORAGE_KEY);
const defaultState = storedState ? { ...rootState, ...JSON.parse(storedState) } : rootState;
window.masterVolume = +defaultState.masterVolume || 1;

export default function settingsReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_SETTINGS: {
      const newSettings = { ...state, ...action.payload };
      if (!isNaN(+action.payload.masterVolume)) window.masterVolume = +action.payload.masterVolume;
      if (!isEqual(newSettings, state)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
        return newSettings;
      }
      return state;
    }
    default:
      return state;
  }
}

export const setSettings = (patch) => ({ type: SET_SETTINGS, payload: patch });
