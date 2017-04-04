const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const addEvent = require('./src/add-event');
const getEvents = require('./src/get-events');
const deleteEvent = require('./src/delete-event');

const app = express();

const getCode = (error) => {
  console.error(error);

  return error.code || 400;
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));

const deExpressYourself = (req) => ({
  params: req.params,
  query: req.query,
  data: req.body,
});

app.post('/api/events', (req, res) => (
  addEvent(deExpressYourself(req))
    .then((data) => res.json(data))
    .catch((err) => res.sendStatus(getCode(err)))
));

app.get('/api/events', (req, res) => (
  deleteEvent(deExpressYourself(req))
    .then((data) => res.json(data))
    .catch((err) => res.sendStatus(getCode(err)))
));

app.delete('/api/events/:id', (req, res) => (
  deleteEvent(deExpressYourself(req).params.id)
    .then((data) => res.json(data))
    .catch((err) => res.sendStatus(getCode(err)))
));

module.exports = app;
