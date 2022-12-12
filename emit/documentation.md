# Sending Messages

``` ts

import * as amqp from 'amqplib';
import * as express from 'express';

// Replace with the connection string for your RabbitMQ server
const rabbitmqConnectionString = 'amqp://localhost';

// Replace with the name of the exchange you want to publish to
const exchangeName = 'my-exchange';

// Create a new express app
const app = express();

// Connect to the RabbitMQ server
const connection = amqp.connect(rabbitmqConnectionString);

// Create a channel
const channel = connection.createChannel();

// Assert that the exchange exists
channel.assertExchange(exchangeName, 'direct', {
  durable: true
});

// Create an API endpoint that sends a message to the exchange
app.post('/send-message', (req, res) => {
  // Publish the message to the exchange
  channel.publish(exchangeName, '', Buffer.from('Hello, world!'));

  // Return a success response
  res.send({
    status: 'success'
  });
});

// Start the express app
app.listen(3000, () => {
  console.log('Listening on port 3000');
});


```