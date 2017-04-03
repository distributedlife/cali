import { combineReducers } from 'redux';
import { reducer } from 'redux-storage';
import eventsReducer from './events';

export default reducer(combineReducers({
  events: eventsReducer,
}));
