import isEqual from 'lodash/isEqual';

const SET_TIMELINE_SETTINGS = 'SET_TIMELINE_SETTINGS';

const STORAGE_KEY = 'timeline_settings';

const rootState = {
  scrollableMode: true,
  magnetMode: true,
  timelineZoom: 1,
  waveZoom: 1,
  playbackSpeed: 1,
};

const storedState = localStorage.getItem(STORAGE_KEY);
const defaultState = storedState ? { ...rootState, ...JSON.parse(storedState) } : rootState;

export default function timelineSettingsReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_TIMELINE_SETTINGS: {
      const newSettings = { ...state, ...action.payload };
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

export const setTimelineSettings = (patch) => ({ type: SET_TIMELINE_SETTINGS, payload: patch });
