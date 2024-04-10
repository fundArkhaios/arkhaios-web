const db = require('../../util/db.js');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type.js');

module.exports = {
    route: "/api/friends/chat-history",
    authenticate: true,
    get: async function(req, res, user) {
        const { friend, page = 1, pageSize = 50 } = req.query;

        if (!friend) {
            return res.status(400).json({ status: RESPONSE_TYPE.FAILED, error: 'Friend id required' });
        }

        let senderId = user.accountID;
        let receiverId = friend;

        // Convert page and pageSize to numbers and calculate skip
        const pageNum = parseInt(page, 10);
        const size = parseInt(pageSize, 10);
        const skip = (pageNum - 1) * size;

        try {
            await db.connect(async (db) => {
                const messages = db.collection("Messages");

                const query = {
                    $or: [
                        { senderId: senderId, receiverId: receiverId },
                        { senderId: receiverId, receiverId: senderId }
                    ]
                };
    
                const history = await messages.find(query)
                                                  .sort({ timestamp: -1 }) // Sort by timestamp descending
                                                  .skip(skip)
                                                  .limit(size)
                                                  .toArray();
    
                res.setHeader('Content-Type', 'application/json');

                if (history.length < 50) {
                    res.status(200).json({status: RESPONSE_TYPE.SUCCESS, data: history, last: true });
                } else {
                    res.status(200).json({status: RESPONSE_TYPE.SUCCESS, data: history, last: false });
                }
                
            });
        } catch (error) {
            console.error('Error retrieving chat history:', error);
            SERVER_ERROR(res);
        }
    }
};