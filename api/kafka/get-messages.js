const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type.js');

module.exports = {
    // Define route for getting most recent messages
    route: "/api/kafka/get-messages",

    // Assuming authentication is required
    authenticate: true,

    // GET method for retrieving messages
    get: async function(req, res, user) {
        const { senderId, receiverId, page = 1, pageSize = 50 } = req.query;

        if (!senderId || !receiverId) {
            return res.status(400).json({ status: RESPONSE_TYPE.FAILURE, error: 'Both senderId and receiverId are required' });
        }

        // Convert page and pageSize to numbers and calculate skip
        const pageNum = parseInt(page, 10);
        const size = parseInt(pageSize, 10);
        const skip = (pageNum - 1) * size;

        try {
            const database = req.app.locals.database; // Adjust if using a different way to access your database
            const messages = database.collection("Messages");

            const query = {
                $or: [
                    { senderId: senderId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            };

            const chatHistory = await messages.find(query)
                                              .sort({ timestamp: -1 }) // Sort by timestamp descending
                                              .skip(skip)
                                              .limit(size)
                                              .toArray();

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({status: RESPONSE_TYPE.SUCCESS, data: chatHistory });
        } catch (error) {
            console.error('Error retrieving messages:', error);
            SERVER_ERROR(res);
        }
    }
};
