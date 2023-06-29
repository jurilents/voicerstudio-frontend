import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import audioReducer from './audioReducer';
import languagesReducer from './languagesReducer';
import settingsReducer from './settingsReducer';
import sessionReducer from './sessionReducer';

const rootReducer = combineReducers({
  audio: audioReducer,
  languages: languagesReducer,
  settings: settingsReducer,
  session: sessionReducer,
});

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
