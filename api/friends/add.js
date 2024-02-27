const db = require('../../util/db');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');
const { logger } = require('../../util/logger')

module.exports = {
    route: "/api/friends/add",
    authenticate: true,
    post: async function(req, res, user) {
        let { id } = req.body;

        if(id == user.id) {
            res.status(200).json({status: RESPONSE_TYPE.FAILED, message: "cannot add self", data: {}})
        }

        try {
            await db.connect(async (db) => {
                try {
                    const target = await db.collection('Users').findOne({
                        accountID: id
                    });

                    if(target) {
                        await db.collection('Friends').updateOne({
                            user: id,
                        }, {$addToSet: { sentRequests: id }}, { upsert: true })

                        await db.collection('Friends').updateOne({
                            user: user.accountID,
                        }, {$addToSet: { receivedRequests: id }}, { upsert: true })

                        res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: "request sent", data: {}})
                    } else {
                        res.status(200).json({status: RESPONSE_TYPE.FAILED, message: "user does not exist", data: {}})
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