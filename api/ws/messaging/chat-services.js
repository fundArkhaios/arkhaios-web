// chatServices.js
const { ObjectId } = require('mongodb');
const { startConsumerForConversation } = require('./messaging-service');
const activeConsumers = {};

async function getChatHistory(db, userID1, userID2) {
  const conversations = db.collection("Conversations");
  const messages = db.collection("Messages");

  console.log(`Finding conversation for users: ${userID1}, ${userID2}`);

  const conversation = await conversations.findOne({
      users: { $all: [userID1, userID2] }
  });

  if (!conversation) {
      throw new Error('Conversation not found');
  }

  return await messages.find({ conversationId: conversation._id })
                       .sort({ timestamp: -1 })
                       .toArray();
}

async function getConsumerForConversation(conversationId) {
    if (!activeConsumers[conversationId]) {
      activeConsumers[conversationId] = await startConsumerForConversation(conversationId);
    }
    return activeConsumers[conversationId];
}
  
function stopConsumerForConversation(conversationId) {
  if (activeConsumers[conversationId]) {
    activeConsumers[conversationId].disconnect();
    delete activeConsumers[conversationId];
  }
}

module.exports = { 
  getChatHistory, 
  getConsumerForConversation, 
  stopConsumerForConversation,
 };