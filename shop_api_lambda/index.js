require('dotenv').config()

module.exports.handler = async (event) => {
  console.log('Event: ', event);
  console.log(`data from .env ${process.env.USERNAME}`);
  let responseMessage = 'Hello, World!!!! - v1.0';

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