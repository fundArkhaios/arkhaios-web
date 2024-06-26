const { startConsumerForUserTopics, sendMessage } = require("../ws/messaging/messaging-service");
const { getUserConversationIds, findOrCreateConversation } = require("../ws/messaging/utils");
const { registerWebSocketForUser, getUserWebSocket } = require("../ws/messaging/websocket-messaging");
const { getChatHistory } = require("../ws/messaging/chat-services");
const db = require("../../util/db");

module.exports = {
    route: '/message-handler',
    authenticate: true,
    websocket: async function(ws, req, user) {
        if(!user) {
            ws.send(JSON.stringify({error: "forbidden"}));
            ws.close()
        }

        registerWebSocketForUser(user.accountID, ws);

        try {
            ws.on('message', async (message) => {
                let parsedMessage;
                try {
                    parsedMessage = JSON.parse(message);
                } catch (error) {
                    ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON message format' }));
                    return;
                }
        
                switch (parsedMessage.type) {
                        case 'sendMessage':
                        try {
                            const { senderId, receiverId, message } = parsedMessage.data;

                            if(senderId != user.accountID) {
                                // Technically senderId shouldn't be passed from the client, but just checking here
                                // so the frontend doesn't need to be changed
                                ws.send(JSON.stringify({ type: 'error', message: 'Invalid sender' }));
                                return
                            }

                            if (!senderId || !receiverId || !message) {
                                ws.send(JSON.stringify({ type: 'error', message: 'Missing required fields' }));
                                return;
                            }
                            let timestamp = new Date().toISOString()
                            try {
                                let conversationId = null;
                                await db.connect(async (db) => {
                                    conversationId = await findOrCreateConversation(db, [senderId, receiverId]);

                                    const messageContent = {
                                        senderId,
                                        receiverId,
                                        message,
                                        timestamp: timestamp,
                                        status: "sent",
                                        conversationId
                                    };
                                
                                    // Insert the new message into the Messages collection
                                    const mrMessage = await db.collection('Messages').insertOne(messageContent);
                                    console.log(mrMessage)
                                
                                    if(mrMessage.acknowledged) {
                                        // Update the corresponding conversation in the Conversations collection
                                        await db.collection('Conversations').updateOne(
                                            { _id: conversationId },
                                            { $push: { messageIDs: mrMessage.insertedId } }
                                        );
                                    }
                                })

                                if(conversationId) {
                                    // Unable to connect to Kafka on dev
                                    if(process.env.NODE_ENV == 'production') {
                                        // Send the message via Kafka
                                        await sendMessage(conversationId, { type: 'receiveMessage', senderId: senderId, receiverId: receiverId,
                                        message: message, timestamp: timestamp });
                                    } else {
                                        const receiverSocket = getUserWebSocket(receiverId);
                                        receiverSocket?.send(JSON.stringify({ type: 'receiveMessage', senderId: senderId, message: message, timestamp: timestamp})); 
                                    }
                                }
                            } catch (e) {
                                console.error(e);
                            };
                        
                            // Respond to the WebSocket client
                            ws.send(JSON.stringify({ type: 'sendMessageResponse', message: 'Message sent and stored successfully' }));
                        } catch (error) {
                            console.log("error being thrown")
                            ws.send(JSON.stringify({ type: 'error', message: error.message }));
                        }
                        break;
                    default:
                        ws.send(JSON.stringify({ type: 'error', message: 'Unrecognized message type' }));
                    }
                });
        } catch (e) {
            response = RESPONSE_TYPE.ERROR
            logger.log({
                level: 'error',
                message: e
            })    
        }

    }
}