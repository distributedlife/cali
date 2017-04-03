const AWS = require('aws-sdk');

const scan = {
  TableName: process.env.EVENTS_TABLE_NAME,
};

const getEvents = () => new AWS.DynamoDB.DocumentClient().scan(scan).promise()
  .then((payload) => payload.Items)
  .then((events) => events.reduce((asObj, event) => {
    asObj[event.date] = { id: event.id, what: event.what, type: event.type };
    return asObj;
  }, {}));

module.exports = getEvents;
