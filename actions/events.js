import axios, { post, get } from 'axios';
import { EVENT_ADDED, EVENTS_RESET_TO_SERVER, EVENT_DELETED } from './';

const eventAdded = (event) => ({
  type: EVENT_ADDED,
  event,
});

const eventDeleted = (id) => ({
  type: EVENT_DELETED,
  id,
});

const eventsResetToServer = (events) => ({
  type: EVENTS_RESET_TO_SERVER,
  events,
});

const base = 'https://on8dujthlh.execute-api.ap-southeast-2.amazonaws.com/Prod';
const eventsUrl = () => `${base}/api/events`;
const eventUrl = (id) => `${base}/api/event/${id}`;

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

export const deleteEvent = (id) => (dispatch) => (
  axios.delete(eventUrl(id))
    .then(() => dispatch(eventDeleted(id)))
);
