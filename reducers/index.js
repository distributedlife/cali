import { combineReducers } from 'redux';
import { reducer } from 'redux-storage';
import eventsReducer from './events';
import timeReducer from './time';

export default reducer(combineReducers({
  events: eventsReducer,
  time: timeReducer,
}));
