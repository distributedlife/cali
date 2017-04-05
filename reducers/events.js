import { EVENT_ADDED, EVENTS_RESET_TO_SERVER, EVENT_DELETED } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case EVENTS_RESET_TO_SERVER:
      return action.events;
    case EVENT_ADDED:
      return {
        ...state,
        [action.event.date]: {
          type: action.event.type,
          what: action.event.what,
          id: action.event.id,
        },
      };
    case EVENT_DELETED:
      Object.keys(state).filter((date) => state[date].id === action.id).forEach((date) => {
        delete state[date];
      });

      return state;
    default:
      return state;
  }
};
