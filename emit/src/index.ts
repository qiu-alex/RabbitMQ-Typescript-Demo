
import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import amqp from 'amqplib';


const PORT = 3000;
const AMQP_URL = 'amqps://gluuahtn:nRdjO88xorXpUWBp1dhiNkWmhoCdN38J@moose.rmq.cloudamqp.com/gluuahtn';
const QUEUE_NAME = 'test';

const app = express();

app.use(bodyParser.json());

//initialize connection
async function connect() {

  // Connect to the RabbitMQ server
  const conn = await amqp.connect(AMQP_URL);

  // Create a channel
  const channel = await conn.createChannel();

  // Assert that the queue exists
  await channel.assertQueue(QUEUE_NAME);
  
  app.post('/register', (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log('Registering user...');
    const msg = {
      action: 'REGISTER',
      data: { email, password },
    }
    const event = JSON.stringify(msg);
    channel.sendToQueue(QUEUE_NAME, Buffer.from(event));
  
    return res.send('OK');
  })
  
  app.post('/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log('Login user...');
    const msg = {
      action: 'LOGIN',
      data: { email, password },
    }
    const event = JSON.stringify(msg);
    channel.sendToQueue(QUEUE_NAME, Buffer.from(event));
  
    return res.send('OK');
  })
  
  app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
  })

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  })
}

connect();
