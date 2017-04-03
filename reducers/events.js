import { EVENT_ADDED, EVENTS_RESET_TO_SERVER } from '../actions';

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
    default:
      return state;
  }
};
