require('dotenv').config();
const { getUserWebSocket } = require('./websocket-messaging.js');

const { Kafka } = require('kafkajs');
const { generateAuthToken } = require('aws-msk-iam-sasl-signer-js')
const { fromEnv } = require("@aws-sdk/credential-providers");

fromEnv();

async function oauthBearerTokenProvider(region) {
    const authTokenResponse = await generateAuthToken({ region })
    console.log(authTokenResponse);
    return { value: authTokenResponse.token };
}

const kafka = new Kafka({
    clientId: 'arkhaios-web',
    brokers: ['b-1.messager.x6qzep.c6.kafka.us-east-2.amazonaws.com:9198','b-2.messager.x6qzep.c6.kafka.us-east-2.amazonaws.com:9198'],
    ssl: true,
    sasl: {
      mechanism: 'oauthbearer',
      oauthBearerProvider: () => oauthBearerTokenProvider('us-east-2')
    }
});

// Function to subscribe a Kafka consumer to multiple topics
async function subscribeToConversationTopics(kafkaConsumer, conversationTopics) {
    try {
        // Subscribe to each topic in the conversationTopics array
        
        kafkaConsumer.subscribe({topics: [conversationTopics]});
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
    const consumer = new kafka.consumer({
        'group.id': `user-consumer-group-${userId}`
    });

    // Connect to Kafka with error handling
    try {
        await consumer.connect();
        console.log(`Consumer ready for user: ${userId}`);
        console.log("topics: " + topics);
        if (Array.isArray(topics) && topics.length > 0) {
            subscribeToConversationTopics(consumer, topics);
            consumer.consume();
        } else {
            console.error(`No topics defined for user ${userId}`);
        }

        await consumer.run({
            eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
                console.log("Testing!");
                console.log("Kafka message received:", message.value.toString());  
                const msg = JSON.parse(message.value.toString());
                
                const userWebSocket = getUserWebSocket(msg.receiverId);
                if (userWebSocket && userWebSocket.readyState === userWebSocket.OPEN) {  // Check if WebSocket is open
                    userWebSocket.send(JSON.stringify({ type: 'newmsg', data: msg }));
                } else {
                    console.error(`WebSocket not open or not found for user: ${message.receiverId}`);
                }
            }
        })
    } catch(e) {
        console.error(`Connection error for user ${userId}:`, e);
    }

  return consumer;
}

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'messaging-group'})

producer.connect().then(() => {
    console.log('Producer is ready');
});

try {
    await consumer.connect();

    consumer.subscribe({ topics: [/conversation-.*/i] })
    
    await consumer.run({
        eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
            const msg = JSON.parse(message.value.toString());
            
            const userWebSocket = getUserWebSocket(msg.receiverId);
            if (userWebSocket && userWebSocket.readyState === userWebSocket.OPEN) {  // Check if WebSocket is open
                userWebSocket.send(JSON.stringify({ type: 'receiveMessage', data: msg }));
            } else {
                console.error(`WebSocket not open or not found for user: ${message.receiverId}`);
            }
        }
    })
} catch(e) {
    console.error(`Connection error for user ${userId}:`, e);
}

// Ideally, above connect() sets some indicator so sendMessage() knows he can actually send

// Function to send a message to the topic corresponding to the conversationId
function sendMessage(conversationId, messageContent) {
    const message = JSON.stringify(messageContent);
    const topic = `conversation-${conversationId}`;  // Create topic name dynamically based on conversationId

    producer.send({
        topic: topic,
        messages: [
            message
        ]
    })
}

module.exports = { startConsumerForUserTopics, subscribeToConversationTopics, sendMessage };