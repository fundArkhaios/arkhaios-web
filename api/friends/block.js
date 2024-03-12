const db = require('../../util/db');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');
const { logger } = require('../../util/logger');

module.exports = {
    route: "/api/friends/block",
    authenticate: true,
    post: async function(req, res, user) {
        let { id } = req.body;

        if(id == user.accountID) {
            res.status(400).json({status: RESPONSE_TYPE.FAILED, message: "cannot block self", data: {}})
        }

        try {
            await db.connect(async (db) => {
                try {
                    const self = await db.collection('Friends').findOne({
                        accountID: user.accountID
                    });

                    if(self && self.friends && self.friends.includes(id)) {
                        // Remove the friend and add to the blocked list for the current user
                        await db.collection('Friends').updateOne({
                            accountID: user.accountID,
                        }, {
                            $pull: { friends: id },
                            $addToSet: { blocked: id }
                        });

                        // Remove the current user from the friend's list of the blocked user
                        await db.collection('Friends').updateOne({
                            accountID: id,
                        }, {
                            $pull: { friends: user.accountID }
                        });

                        res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: "user blocked", data: {}})
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
