import {applyMiddleware, combineReducers, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import audioReducer from './audioReducer';
import languagesReducer from './languagesReducer';
import sessionReducer from './sessionReducer';
import settingsReducer from './settingsReducer';
import timelineReducer from './timelineReducer';
import timelineSettingsReducer from './timelineSettingsReducer';
import playerReducer from './playerReducer';

const rootReducer = combineReducers({
  audio: audioReducer,
  languages: languagesReducer,
  player: playerReducer,
  session: sessionReducer,
  settings: settingsReducer,
  timeline: timelineReducer,
  timelineSettings: timelineSettingsReducer,
});

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
