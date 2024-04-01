const db = require('../../util/db');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');
const { logger } = require('../../util/logger');
const { ObjectId } = require('mongodb');

module.exports = {
    route: "/api/account/read-notification",
    authenticate: true,
    post: async function (req, res, user) {
        if(!req.body.id) {
            return res.status(200).json({status: RESPONSE_TYPE.FAILED, message: "requires id", data: {}});
        }

        try {
            await db.connect(async (db) => {
                try {
                    await db.collection('Notifications').updateOne({ event_id: req.body.id }, { $set: { read: true } })

                    return res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: "", data: {}});
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