/* eslint-disable space-before-blocks */
/* eslint-disable prefer-template */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable padded-blocks */
/* eslint-disable no-trailing-spaces */
/* eslint-disable semi */
/* eslint-disable spaced-comment */
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import express, { Request, Response } from 'express'
import amqp from 'amqplib'

//import createMQConsumer from './consumer'

dotenv.config()

const PORT = 3001
const AMQP_URL = 'amqps://gluuahtn:nRdjO88xorXpUWBp1dhiNkWmhoCdN38J@moose.rmq.cloudamqp.com/gluuahtn'
const QUEUE_NAME = 'test'

const app = express();
app.use(bodyParser.json());
//const consumer = createMQConsumer(AMQP_URL, QUEUE_NAME)

//consumer()
async function connect() {
  const conn = await amqp.connect(AMQP_URL);

  const channel = await conn.createChannel();

  await channel.assertQueue(QUEUE_NAME);

  channel.consume(QUEUE_NAME, (msg) => {
    if (msg){
      console.log(msg.content.toString());
      channel.ack(msg);
    } else {
      console.log('Msg not found');
    }
  });

  app.get('/', (req: Request, res: Response) => {
    res.send('hello world');
  })
  
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
  })
  
}

connect();
