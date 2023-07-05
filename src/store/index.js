import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import audioReducer from './audioReducer';
import languagesReducer from './languagesReducer';
import sessionReducer from './sessionReducer';
import settingsReducer from './settingsReducer';
import timelineReducer from './timelineReducer';

const rootReducer = combineReducers({
  audio: audioReducer,
  languages: languagesReducer,
  session: sessionReducer,
  settings: settingsReducer,
  timeline: timelineReducer,
});

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
