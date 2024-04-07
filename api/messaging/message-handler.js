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

        console.log("MESSAGE-HANDLER API");
        registerWebSocketForUser(user.accountID, ws);
        try {
                ws.on('message', async (message) => {
                    console.log("receiving message");
                    let parsedMessage;
                    try {
                        parsedMessage = JSON.parse(message);
                    } catch (error) {
                        ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON message format' }));
                        return;
                    }
            
                    switch (parsedMessage.type) {
                        case 'openMessagesTab':
                            console.log("openmessages");
                            try {
                                const { userID } = parsedMessage.data;
                                //console.log(`Opening messages tab for user ${userID}`);
                                const conversationTopics = await getUserConversationIds(db, userID);
                                //console.log(`Topics to subscribe for user ${userID}:`, conversationTopics);
                                const kafkaConsumer = await startConsumerForUserTopics(userID, conversationTopics);
                                // No need to call subscribeToConversationT opics here as it's handled in startConsumerForUserTopics
                                ws.send(JSON.stringify({ type: 'openMessagesTabResponse', message: 'Subscribed to all conversation topics' }));
                            } catch (error) {
                                console.error(`Error in openMessagesTab:`, error);
                                ws.send(JSON.stringify({ type: 'error', message: error.message }));
                            }
                            break;
            
            
                            case 'sendMessage':
                                console.log("send message");
                            try {
                                console.log("sendsdkfjsdnjf");
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

                                try {
                                    await db.connect(async (db) => {
                                        // should only be opened for duration we need db
                                        const conversationId = await findOrCreateConversation(db, [senderId, receiverId]);
                                        // Looks like it's not returning anything.. 
                                        console.log("ConversationID: " + conversationId);
                                        const messageContent = {
                                            senderId,
                                            receiverId,
                                            message,
                                            timestamp: new Date().toISOString(),
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
                                } catch (e) {
                                    console.error(e);
                                };
                                
                            
                                // Unable to connect to Kafka on dev
                                if(process.env.NODE_ENV == 'production') {
                                    // Send the message via Kafka
                                    sendMessage(conversationId, messageContent);
                                } else {
                                    const receiverSocket = getUserWebSocket(receiverId);
                                    receiverSocket?.send(JSON.stringify({ type: 'receiveMessage', senderId: senderId, message: message })); 
                                }
                            
                                // Respond to the WebSocket client
                                ws.send(JSON.stringify({ type: 'sendMessageResponse', message: 'Message sent and stored successfully' }));
                            } catch (error) {
                                console.log("error being thrown")
                                ws.send(JSON.stringify({ type: 'error', message: error.message }));
                            }
                            break;
                            
                        
                        case 'joinConversation':
                            try {
                                const { userID2 } = parsedMessage.data;
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
        } catch (e) {
            response = RESPONSE_TYPE.ERROR
            logger.log({
                level: 'error',
                message: e
            })    
        }

    }
}