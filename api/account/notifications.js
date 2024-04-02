const db = require('../../util/db');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');
const { logger } = require('../../util/logger')

module.exports = {
    route: "/api/account/notifications",
    authenticate: true,
    get: async function (req, res, user) {
        if(!user.brokerageID) {
            return res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: "", data: []});
        }

        try {
            await db.connect(async (db) => {
                try {
                    let result = [];

                    let sorting = { time: -1 };

                    let notifications = await db.collection('Notifications').find({ user: user.brokerageID }).sort(sorting).toArray();
                    for(let i in notifications) {
                        result.push({id: notifications[i].event_id, message: notifications[i].message,
                            read: notifications[i].read, time: notifications[i].time });
                    }

                    return res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: "", data: result});
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