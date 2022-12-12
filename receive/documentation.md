# Consuming Messages

``` ts

import * as amqp from 'amqplib';
import * as express from 'express';

// Replace with the connection string for your RabbitMQ server
const rabbitmqConnectionString = 'amqp://localhost';

// Replace with the name of the queue you want to consume messages from
const queueName = 'my-queue';

// Connect to the RabbitMQ server
const connection = amqp.connect(rabbitmqConnectionString);

// Create a channel
const channel = connection.createChannel();

// Assert that the queue exists
channel.assertQueue(queueName);

// Create a new express app
const app = express();

// Create an API endpoint that consumes a message from the queue
app.get('/consume-message', (req, res) => {
  // Consume a message from the queue
  const message = channel.get(queueName);

  // Check if a message was received
  if (message) {
    // Print the content of the message to the console
    console.log(message.content.toString());

    // Acknowledge the message
    channel.ack(message);

    // Return the message in the response
    res.send({
      message: message.content.toString()
    });
  } else {
    // Return an error if no message was received
    res.status(404).send({
      error: 'No messages available'
    });
  }
});

// Start the express app
app.listen(3000, () => {
  console.log('Listening on port 3000');
});


```