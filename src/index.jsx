import 'core-js';
import 'normalize.css';
import './libs/contextmenu.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {isMobile} from './utils';
import App from './App';
import Mobile from './Mobile';
import GlobalStyle from './styles/GlobalStyle';
import TutorStyle from './styles/TutorStyles';
import {Provider} from 'react-redux';
import {store} from './store';
import './i18n';


ReactDOM.render(
  <Provider store={store}>
    <React.Fragment>
      <GlobalStyle/>
      <TutorStyle/>
      {isMobile ? <Mobile/> : <App/>}
    </React.Fragment>
  </Provider>,
  document.getElementById('root'),
);
