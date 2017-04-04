const AWS = require('aws-sdk');

const deleteEvent = (id) => new AWS.DynamoDB.DocumentClient().deleteItem({
  TableName: process.env.EVENTS_TABLE_NAME,
  Key: {
    id,
  },
}).promise();

module.exports = deleteEvent;
