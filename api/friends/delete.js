const db = require('../../util/db');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');
const { logger } = require('../../util/logger');

module.exports = {
    route: "/api/friends/delete",
    authenticate: true,
    post: async function(req, res, user) {
        let { id } = req.body;

        if(id == user.accountID) {
            res.status(200).json({status: RESPONSE_TYPE.FAILED, message: "cannot remove self", data: {}})
        }

        try {
            await db.connect(async (db) => {
                try {
                    // Check if the user is indeed a friend
                    const self = await db.collection('Friends').findOne({
                        accountID: user.accountID
                    });

                    if(self && self.friends && self.friends.includes(id)) {
                        // Remove the friend from the current user's list
                        await db.collection('Friends').updateOne({
                            accountID: user.accountID,
                        }, {$pull: { friends: id }});

                        // Remove the current user from the friend's list
                        await db.collection('Friends').updateOne({
                            accountID: id,
                        }, {$pull: { friends: user.accountID }});

                        res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: "friend removed", data: {}})
                    } else {
                        res.status(400).json({status: RESPONSE_TYPE.FAILED, message: "user is not a friend", data: {}})
                    }
                } catch(e) {
                    logger.log({
                        level: 'error',
                        message: e
                    });
        
                    SERVER_ERROR(res);
                }
            });
        } catch(e) {
            logger.log({
                level: 'error',
                message: e
            });

            SERVER_ERROR(res);
        }
    }
};
