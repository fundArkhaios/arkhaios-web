const Kafka = require('node-rdkafka');

async function runConsumer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const database = client.db("db");
    const messages = database.collection("Messages");

    // Kafka Consumer setup
    const consumer = new Kafka.KafkaConsumer({
      'group.id': 'testgroup',
      'metadata.broker.list': 'localhost:9092',
    }, {});

    consumer.connect();

    consumer
      .on('ready', () => {
        console.log('Consumer is ready');
        consumer.subscribe(['test']);
        consumer.consume();
      })
      .on('data', async (data) => {
        try {
          const message = JSON.parse(data.value.toString());
          
          // Insert message into MongoDB
          await messages.insertOne({
            _id: message._id,
            senderId: message.senderId,
            receiverId: message.receiverId,
            message: message.message,
            timestamp: message.timestamp,
            status: message.status
          });
        } catch (error) {
          console.error('Error processing message:', data.value.toString());
          console.error(error);
        }
      });
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}

runConsumer().catch(console.dir);
