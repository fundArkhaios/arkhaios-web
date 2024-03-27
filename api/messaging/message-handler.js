const { startConsumerForUserTopics, sendMessage } = require("../ws/messaging/messaging-service");
const { getUserConversationIds, findOrCreateConversation } = require("../ws/messaging/utils");
const { registerWebSocketForUser } = require("../ws/messaging/websocket-messaging");
const { getUserConversationIds, findOrCreateConversation } = require("../ws/messaging/utils");
const { getChatHistory } = require("../ws/messaging/chat-services");



module.exports = {
    route: '/message-handler',
    authenticate: true,
    websocket: async function(ws, req, user) {
        if(!user) {
            ws.send(JSON.stringify({error: "forbidden"}));
            ws.close()
        }

        registerWebSocketForUser(user.accountID, ws);
       

        ws.on('message', async (message) => {
            let parsedMessage;
            try {
                parsedMessage = JSON.parse(message);
            } catch (error) {
                ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON message format' }));
                return;
            }
    
            switch (parsedMessage.type) {
                case 'openMessagesTab':
                    try {
                        const { userID } = parsedMessage.data;
                        //console.log(`Opening messages tab for user ${userID}`);
                        const conversationTopics = await getUserConversationIds(db, userID);
                        //console.log(`Topics to subscribe for user ${userID}:`, conversationTopics);
                        const kafkaConsumer = await startConsumerForUserTopics(userID, conversationTopics);
                        // No need to call subscribeToConversationTopics here as it's handled in startConsumerForUserTopics
                        ws.send(JSON.stringify({ type: 'openMessagesTabResponse', message: 'Subscribed to all conversation topics' }));
                    } catch (error) {
                        console.error(`Error in openMessagesTab:`, error);
                        ws.send(JSON.stringify({ type: 'error', message: error.message }));
                    }
                    break;
    
    
                    case 'sendMessage':
                    try {
                        const { senderId, receiverId, message } = parsedMessage.data;
                        if (!senderId || !receiverId || !message) {
                            ws.send(JSON.stringify({ type: 'error', message: 'Missing required fields' }));
                            return;
                        }
                        const conversationId = await findOrCreateConversation(db, [senderId, receiverId]);

                        const messageContent = {
                            _id: new ObjectId(),
                            senderId,
                            receiverId,
                            message,
                            timestamp: new Date().toISOString(),
                            status: "sent",
                            conversationId
                        };
                    
                        // Insert the new message into the Messages collection
                        await db.collection('Messages').insertOne(messageContent);
                    
                        // Update the corresponding conversation in the Conversations collection
                        await db.collection('Conversations').updateOne(
                            { _id: conversationId },
                            { $push: { messageIDs: messageContent._id } }
                        );
                    
                        // Send the message via Kafka
                        sendMessage(conversationId, messageContent);
                    
                        // Respond to the WebSocket client
                        ws.send(JSON.stringify({ type: 'sendMessageResponse', message: 'Message sent and stored successfully' }));
                    } catch (error) {
                        ws.send(JSON.stringify({ type: 'error', message: error.message }));
                    }
                    break;
                    
                
                case 'joinConversation':
                    try {
                        const { userID1, userID2 } = parsedMessage.data;
                        getChatHistory
                        const chatHistory = await getChatHistory(db, userID1, userID2);
                        ws.send(JSON.stringify({ type: 'joinConversationResponse', data: chatHistory }));
                    } catch (error) {
                        ws.send(JSON.stringify({ type: 'error', message: error.message }));
                    }
                    break;
    
                default:
                    ws.send(JSON.stringify({ type: 'error', message: 'Unrecognized message type' }));
            }
        });
    }
}