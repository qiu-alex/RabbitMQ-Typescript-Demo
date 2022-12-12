import amqp, { Channel, Connection } from 'amqplib/callback_api'

const createMQProducer = (amqpUrl: string, queueName: string) => {
  console.log('Connecting to RabbitMQ...')
  // console.log(amqpUrl, queueName);
  let ch: any
  amqp.connect(amqpUrl, (errorConnect: Error, connection: Connection) => {
    if (errorConnect) {
      console.log('Error connecting to RabbitMQ: ', errorConnect)
      return
    }

    connection.createChannel((errorChannel: Error, channel: Channel) => {
      if (errorChannel) {
        console.log('Error creating channel: ', errorChannel)
        return
      }

      ch = channel
      console.log('Connected to RabbitMQ')
    })
  })
  return (msg: string) => {
    console.log('Produce message to RabbitMQ...')
    ch.sendToQueue(queueName, Buffer.from(msg))
  }
}

export default createMQProducer
