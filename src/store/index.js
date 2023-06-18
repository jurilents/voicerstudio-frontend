import { applyMiddleware, combineReducers, createStore } from 'redux';
import audioReducer from './audioReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  audio: audioReducer,
});

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
