import { post, get } from 'axios';
import { EVENT_ADDED, EVENTS_RESET_TO_SERVER } from './';

const eventAdded = (event) => ({
  type: EVENT_ADDED,
  event,
});

const eventsResetToServer = (events) => ({
  type: EVENTS_RESET_TO_SERVER,
  events,
});

const base = 'https://on8dujthlh.execute-api.ap-southeast-2.amazonaws.com/Prod';
const eventsUrl = () => `${base}/api/events`;

export const addEvent = (eventData) => (dispatch) => (
  post(eventsUrl(), eventData)
    .then((response) => response.data)
    .then((createdEvent) => dispatch(eventAdded(createdEvent)))
);

export const getEvents = () => (dispatch) => (
  get(eventsUrl())
    .then((response) => response.data))
    .then((events) => dispatch(eventsResetToServer(events)),
);
