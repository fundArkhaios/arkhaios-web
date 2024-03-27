const Kafka = require('node-rdkafka');
require('dotenv').config();
const { getUserWebSocket } = require('./websocket-messaging.js');

// Function to subscribe a Kafka consumer to multiple topics
async function subscribeToConversationTopics(kafkaConsumer, conversationTopics) {
    try {
        // Subscribe to each topic in the conversationTopics array
        
        kafkaConsumer.subscribe([conversationTopics]);
        console.log("Conversation Topic: " + conversationTopics)
        // Log successful subscription
        console.log(`Subscribed to topics: ${conversationTopics.join(', ')}`);
    } catch (error) {
        // Handle any errors that occur during subscription
        console.error(`Error subscribing to topics: ${error.message}`);
        throw error;
    }
  }

// Function to create and start a Kafka consumer for user topics
async function startConsumerForUserTopics(userId, topics) {
  const consumer = new Kafka.KafkaConsumer({
        'group.id': `user-consumer-group-${userId}`,
        'metadata.broker.list': 'b-3.messenger.ggbw5c.c4.kafka.us-east-2.amazonaws.com:9098,b-1.messenger.ggbw5c.c4.kafka.us-east-2.amazonaws.com:9098,b-2.messenger.ggbw5c.c4.kafka.us-east-2.amazonaws.com:9098',
        'security.protocol': 'SASL_SSL',
        'sasl.mechanism': 'AWS_MSK_IAM',
        'sasl.jaas.config': 'software.amazon.msk.auth.iam.IAMLoginModule required;',
  }, {});

  // Connect to Kafka with error handling
  consumer.connect({}, (err) => {
      if (err) {
          console.error(`Connection error for user ${userId}:`, err);
          throw err;
      }
  });

  // Handle ready state
  consumer.on('ready', () => {
      console.log(`Consumer ready for user: ${userId}`);
      // Ensure topics are defined and array is not empty
      console.log("topics: " + topics);
      if (Array.isArray(topics) && topics.length > 0) {
          subscribeToConversationTopics(consumer, topics);
          consumer.consume();
      } else {
          console.error(`No topics defined for user ${userId}`);
      }
  })
  
  consumer.on('event', (event) => {
    console.log("Event: " + event);
  })

  consumer.on('data', (message) => {
    console.log("Testing!");
    console.log("Kafka message received:", message.value.toString());  
    const msg = JSON.parse(message.value.toString());

    // TODO: Implement getUserWebSocket to map msg receiver to WebSocket connection
    const userWebSocket = getUserWebSocket(msg.receiverId);
    if (userWebSocket && userWebSocket.readyState === userWebSocket.OPEN) {  // Check if WebSocket is open
        userWebSocket.send(JSON.stringify({ type: 'newmsg', data: msg }));
    } else {
        console.error(`WebSocket not open or not found for user: ${message.receiverId}`);
    }
});

  // Add error handling
  consumer.on('error', (err) => {
      console.error(`Consumer error for user ${userId}:`, err);
  });

  return consumer;
}

const producer = new Kafka.Producer({
        'metadata.broker.list': 'b-3.messenger.ggbw5c.c4.kafka.us-east-2.amazonaws.com:9098,b-1.messenger.ggbw5c.c4.kafka.us-east-2.amazonaws.com:9098,b-2.messenger.ggbw5c.c4.kafka.us-east-2.amazonaws.com:9098',
        'dr_cb': true,
        'security.protocol': 'SASL_SSL',
        'sasl.mechanism': 'AWS_MSK_IAM',
});

// Logging debug messages, if debug is enabled
producer.on('event.log', log => console.log(log));

// Handling errors
producer.on('event.error', err => {
    console.error('Error from producer');
    console.error(err);
});

// Called after the producer has connected
producer.on('ready', () => {
    console.log('Producer is ready');
    // Producer is ready to send messages when required
});

producer.on('delivery-report', (err, report) => {
    // Report of delivery statistics here:
    console.log('delivery-report: ', report);
});

// Function to send a message to the topic corresponding to the conversationId
function sendMessage(conversationId, messageContent) {
    const message = JSON.stringify(messageContent);
    const topic = `conversation-${conversationId}`;  // Create topic name dynamically based on conversationId
    console.log(topic);
    console.log("Sending message to topic:", topic);
    producer.produce(topic, null, Buffer.from(message), null);
}

// Connecting to Kafka
producer.connect();

module.exports = { startConsumerForUserTopics, subscribeToConversationTopics, sendMessage };