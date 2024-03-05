const { sendMessage } = require('../../util/kafka/kafka-producer');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type.js');

module.exports = {
    // Define route for sending messages
    route: "/api/send-messages",

    // Assuming authentication is required
    authenticate: true,

    // POST method for sending messages
    post: async function(req, res, user) {
        const { senderId, receiverId, message } = req.body;

        // Basic validation
        if (!senderId || !receiverId || !message) {
            return res.status(400).json({ status: RESPONSE_TYPE.FAILURE, error: 'Missing required fields' });
        }

        const messageContent = {
            _id: new ObjectId(),  // Generate unique ID for the message
            senderId,
            receiverId,
            message,
            timestamp: new Date().toISOString(),
            status: "sent"
        };

        try {
            // Send message to Kafka
            sendMessage(messageContent);

            // Store message in MongoDB
            const database = req.app.locals.database; // Adjust if using a different way to access your database
            const messages = database.collection('Messages');
            await messages.insertOne(messageContent);

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ status: RESPONSE_TYPE.SUCCESS, message: 'Message sent and stored successfully' });
        } catch (error) {
            console.error('Error sending or storing message:', error);
            SERVER_ERROR(res);
        }
    }
};
