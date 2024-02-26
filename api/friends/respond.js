const db = require('../../util/db');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');
const { logger } = require('../../util/logger')

module.exports = {
    route: "/api/friends/respond",
    authenticate: true,
    post: async function(req, res, user) {
        let { id, action } = req.body;

        accept = action == 'accept'

        if(action != 'accept' && action != 'reject') {
            res.status(400).json({
                status: RESPONSE_TYPE.FAILED,
                message: "action must be 'accept' or 'reject'"
            })
        }

        try {
            await db.connect(async (db) => {
                try {
                    const self = await db.collection('Friends').findOne({
                        accountID: user.accountID
                    })

                    if(self?.receivedRequests?.includes(id)) {
                        await db.collection('Friends').updateOne({
                            user: user.accountID
                        }, {
                            $addToSet: accept ? { friends: id } : {},
                            $pull: { receivedRequests: id }
                        })

                        await db.collection('Friends').updateOne({
                            user: id
                        }, {
                            $addToSet: accept ? { friends: user.accountID } : {},
                            $pull: { sentRequests: user.accountID }
                        })

                        res.status(200).json({
                            status: RESPONSE_TYPE.SUCCESS,
                            message: "friend request " + (accept ? "accepted" : "rejected"),
                            data: {}
                        })
                    } else {
                        res.status(400).json({status: RESPONSE_TYPE.FAILED, message: "invalid user", data: {}})
                    }
                } catch(e) {
                    logger.log({
                        level: 'error',
                        message: e
                    })
        
                    SERVER_ERROR(res)
                }
            })
        } catch(e) {
            logger.log({
                level: 'error',
                message: e
            })

            SERVER_ERROR(res)
        }
    }
}