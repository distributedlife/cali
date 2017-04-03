import createEngine from 'redux-storage-engine-reactnativeasyncstorage';
import { createLoader, createMiddleware } from 'redux-storage';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducer from '../reducers/index';

const storageEngine = createEngine('field-ops');
const storageEngineMiddleware = createMiddleware(storageEngine);
const createStoreWithMiddleware = applyMiddleware(thunk, storageEngineMiddleware)(createStore);
const store = createStoreWithMiddleware(reducer);
const load = createLoader(storageEngine);
load(store);

export default store;
