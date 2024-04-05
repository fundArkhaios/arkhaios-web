const db = require('../../util/db');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');
const { logger } = require('../../util/logger');

module.exports = {
    route: "/api/friends/add",
    authenticate: true,
    post: async function(req, res, user) {
        let { username } = req.body;

        if (username == user.username) {
            res.status(200).json({status: RESPONSE_TYPE.FAILED, message: "cannot add self", data: {}})
            return;
        }

        try {
            await db.connect(async (db) => {
                try {
                    const self = await db.collection('Friends').findOne({
                        accountID: user.accountID
                    });
                    
                    const targetFriend = await db.collection('Users').findOne({
                        username: username
                    });

                    if (targetFriend) {
                        const id = targetFriend.accountID;
                        const target = await db.collection('Friends').findOne({
                            accountID: id
                        });
                        
                        // Check if either user is already befriended
                        if (self?.friends?.includes(id)) {
                            res.status(401).json({status: RESPONSE_TYPE.FAILED, message: "user already befriended", data: {}})
                            return;
                        }

                        // Check if either user is in the other's blocked list
                        if (self?.blocked?.includes(id) || target?.blocked?.includes(user.accountID)) {
                            res.status(401).json({status: RESPONSE_TYPE.FAILED, message: "cannot add a blocked user", data: {}})
                            return;
                        }

                        await db.collection('Friends').updateOne({
                            accountID: id,
                        }, {$addToSet: { receivedRequests: user.accountID }}, { upsert: true });

                        await db.collection('Friends').updateOne({
                            accountID: user.accountID,
                        }, {$addToSet: { sentRequests: id }}, { upsert: true });

                        res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: "request sent", data: {}})
                    } else {
                        res.status(200).json({status: RESPONSE_TYPE.FAILED, message: "user does not exist", data: {}})
                    }
                } catch (e) {
                    logger.log({
                        level: 'error',
                        message: e
                    });
        
                    SERVER_ERROR(res);
                }
            });
        } catch (e) {
            logger.log({
                level: 'error',
                message: e
            });

            SERVER_ERROR(res);
        }
    }
};
