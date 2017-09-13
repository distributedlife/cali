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

const base = 'https://api.cali-prd.com';
const eventsUrl = () => `${base}/events`;
const eventUrl = (id) => `${base}/event/${id}`;

export const addEvent = (eventData) => (dispatch) => (
  post(eventsUrl(), eventData)
    .then((response) => response.data)
    .then((createdEvent) => dispatch(eventAdded(createdEvent)))
    .catch(console.error)
);

export const getEvents = () => (dispatch) => (
  get(eventsUrl())
    .then((response) => response.data)
    .then((events) => dispatch(eventsResetToServer(events)))
    .catch(console.error)
);

export const deleteEvent = (id) => (dispatch) => (
  axios.delete(eventUrl(id))
    .then(() => dispatch(eventDeleted(id)))
    .catch(console.error)
);
