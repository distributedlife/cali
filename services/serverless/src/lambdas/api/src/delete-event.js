const AWS = require('aws-sdk');

const deleteEvent = (id) => new AWS.DynamoDB.DocumentClient().delete({
  TableName: process.env.EVENTS_TABLE_NAME,
  Key: {
    id,
  },
}).promise();

module.exports = deleteEvent;
