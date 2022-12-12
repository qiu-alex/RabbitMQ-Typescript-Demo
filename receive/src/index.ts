import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import amqp from 'amqplib';

const PORT = 3001;
const AMQP_URL = 'Put your own url';
const QUEUE_NAME = 'test';

const app = express();
app.use(bodyParser.json());

async function connect() {
  const conn = await amqp.connect(AMQP_URL);

  const channel = await conn.createChannel();

  await channel.assertQueue(QUEUE_NAME);

  //consume messages and log them
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
