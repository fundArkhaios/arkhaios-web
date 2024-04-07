require('dotenv').config();
const { Kafka } = require('kafkajs');
const { generateAuthToken } = require('aws-msk-iam-sasl-signer-js')
const { fromEnv } = require("@aws-sdk/credential-providers");

fromEnv();

async function oauthBearerTokenProvider(region) {
    const authTokenResponse = await generateAuthToken({ region })
    return { value: authTokenResponse.token };
}

async function createKafkaTopic(topicName) {
    const kafka = new Kafka({
        clientId: 'arkhaios-web',
        brokers: ['b-1.messager.x6qzep.c6.kafka.us-east-2.amazonaws.com:9098','b-2.messager.x6qzep.c6.kafka.us-east-2.amazonaws.com:9098'],
        ssl: true,
        sasl: {
        mechanism: 'oauthbearer',
        oauthBearerProvider: () => oauthBearerTokenProvider('us-east-2')
        }
    });

    const admin = kafka.admin()

    try {
        await admin.connect();
    
        await admin.createTopics({
            topics: {
                topic: topicName,
                numPartitions: 1,
                replicationFactor: 2,
            }
        })

        await admin.disconnect();
    } catch(e) {}
}

async function getUserConversationIds(db, accountId) {
    try {
        const user = await db.collection('Friends').findOne({ accountID: accountId });
        // Assuming the user's friends are stored in 'friends' field
        const friends = user.friends || []; 
        for (const friendId of friends) {
            // For each friend, find or create a conversation
            await findOrCreateConversation(db, [accountId, friendId]);
        }

        // After processing all friends, refetch the user to get updated conversation IDs
        user = await db.collection('Friends').findOne({ accountID: accountId });
        if (user && user.conversationIDs) {
            const conversationIds = user.conversationIDs.map(id => `conversation-${id.toString()}`);
            console.log(`Conversation IDs for user ${accountId}:`, conversationIds);
            return conversationIds;
        } else {
            console.log(`No conversations found for user ${accountId}`);
            return []; // No conversations found
        }
    } catch (error) {
        console.error('Error fetching user conversation IDs:', error);
        throw error;
    }
}

async function createNewConversation(db, userIds) {
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        throw new Error('User IDs array is invalid.');
    }

    userIds.sort();
    const newConversation = {
        users: userIds,
        messageIDs: []
    };

    const result = await db.collection('Conversations').insertOne(newConversation);
    const newConversationId = result.insertedId;

     // Add newConversationId to each user's conversationIDs array
     await Promise.all(userIds.map(userId => 
        db.collection('Friends').updateOne(
            { accountID: userId },
            { $addToSet: { conversationIDs: newConversationId }}
        )
    ));

    // Kafka topic creation
    try {
        await createKafkaTopic(`conversation-${newConversationId}`);
        console.log(`Kafka topic created for conversation ID: ${newConversationId}`);
    } catch (error) {
        console.error('Error creating Kafka topic:', error);
        throw new Error('Failed to create conversation topic.');
    }

    return newConversationId;
}

async function getExistingConversation(db, userIds) {
    try {
        userIds.sort();
        return await db.collection('Conversations').findOne({
            users: { $all: userIds }
        });
    } catch (e) {
        console.error(e);
    }
    
}

async function findOrCreateConversation(db, userIds) {
    console.log("db: " + db);
    console.log('ids')
    console.log(userIds);
    const existingConversation = await getExistingConversation(db, userIds);
    console.log("Existing conversation: " + existingConversation)
    console.log("existing convo: " + existingConversation);
    if (existingConversation) {
        return existingConversation._id;
    } else {
        console.log("should be creating a new convo")
        return createNewConversation(db, userIds);
    }
}

module.exports = { createKafkaTopic, getUserConversationIds, createNewConversation, getExistingConversation, findOrCreateConversation };