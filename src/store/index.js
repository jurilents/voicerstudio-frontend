import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import audioReducer from './audioReducer';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
  audio: audioReducer,
  settings: settingsReducer,
});

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
