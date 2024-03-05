const Kafka = require('node-rdkafka');

const producer = new Kafka.Producer({
    'metadata.broker.list': 'localhost:9092',
    'dr_cb': true  // Delivery report callback
});

// The topic you will be sending messages to
const topic = 'test';

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

// Function to send a message
function sendMessage(messageContent) {
    const message = JSON.stringify(messageContent);
    producer.produce(topic, null, Buffer.from(message), null);
}

// Connecting to Kafka
producer.connect();

module.exports = { sendMessage };
