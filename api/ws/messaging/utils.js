const Kafka = require('node-rdkafka');

async function createKafkaTopic(topicName) {
    const adminClient = Kafka.AdminClient.create({
    'client.id': 'kafka-admin',
    'metadata.broker.list': 'b-3.messenger.ggbw5c.c4.kafka.us-east-2.amazonaws.com:9098,b-1.messenger.ggbw5c.c4.kafka.us-east-2.amazonaws.com:9098,b-2.messenger.ggbw5c.c4.kafka.us-east-2.amazonaws.com:9098',
    // Include other configurations as needed for your MSK setup
    'security.protocol': 'SASL_SSL',
    'sasl.mechanism': 'AWS_MSK_IAM',
    'sasl.jaas.config': 'software.amazon.msk.auth.iam.IAMLoginModule required;',
    // Add SSL properties if needed
});


    return new Promise((resolve, reject) => {
        adminClient.createTopic({
            topic: topicName,
            num_partitions: 1,
            replication_factor: 2
        }, (err) => {
            adminClient.disconnect();
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
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
    userIds.sort();
    return await db.collection('Conversations').findOne({
        users: { $all: userIds }
    });
}

async function findOrCreateConversation(db, userIds) {
    const existingConversation = await getExistingConversation(db, userIds);
    if (existingConversation) {
        return existingConversation._id;
    } else {
        return await createNewConversation(db, userIds);
    }
}

module.exports = { createKafkaTopic, getUserConversationIds, createNewConversation, getExistingConversation, findOrCreateConversation };