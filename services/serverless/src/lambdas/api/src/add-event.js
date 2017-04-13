const uuid = require('uuid').v4;
const insertInTable = require('../../../helpers/insertInTable');

const addId = (event) => Object.assign({}, event, { id: event.id || uuid() });

const addEvent = (payload) => Promise.resolve(addId(payload.data))
  .then((event) => insertInTable(process.env.EVENTS_TABLE_NAME, event).then(() => event));

module.exports = addEvent;
