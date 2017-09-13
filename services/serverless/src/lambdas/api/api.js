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

app.post('/events', (req, res) => (
  addEvent(deExpressYourself(req))
    .then((data) => res.json(data))
    .catch((err) => res.sendStatus(getCode(err)))
));

app.get('/events', (req, res) => (
  getEvents()
    .then((data) => res.json(data))
    .catch((err) => res.sendStatus(getCode(err)))
));

app.delete('/event/:id', (req, res) => (
  deleteEvent(req.params.id)
    .then(() => res.sendStatus(200))
    .catch((err) => res.sendStatus(getCode(err)))
));

module.exports = app;
