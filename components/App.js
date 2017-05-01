import React from 'react';
import { Provider } from 'react-redux';
import MainAppView from './MainAppView';
import store from '../util/store';

const App = () => (
  <Provider store={store}>
    <MainAppView />
  </Provider>
);

export default App;
