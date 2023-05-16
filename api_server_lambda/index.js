const express = require("express");
require('dotenv').config()

const app = express();
app.use(express.json())

const AWS = require("aws-sdk")
const sns = new AWS.SNS({ region: "ap-northeast-2" })

module.exports.handler = async (event) => {
  console.log('Event: ', event);
  let responseMessage = `Hello, World!!!! - ${process.env.CODE_VERSION}`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: responseMessage,
    }),
  }
}
