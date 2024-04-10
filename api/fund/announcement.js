const db = require('../../util/db.js');
const {RESPONSE_TYPE} = require('../response_type.js')

const { logger } = require('../../util/logger')

module.exports = {
    route: '/api/fund/announcement',
    kyc: true,
    post: async function(req, res, user) {
        try {
            const id = req.body.id;
            const title = req.body.title;
            const body = req.body.body;
            
            if(!user.fundsManaging?.includes(id)) {
                return res.status(401).json({status: RESPONSE_TYPE.FAILED, message: "Unauthorized"});
            }

            const announcement = {
                title: title,
                body: body,
                time: Math.floor(Date.now() / 1000)
            }

            await db.connect(async (db) => {
                try {
                    let response = await db.collection('FundAnnouncements').updateOne({"fundID": id},
                        { $addToSet: { announcements: announcement } }, {upsert: true});

                    if(response.acknowledged) {
                        res.status(200).json({status: RESPONSE_TYPE.SUCCESS,
                            message: 'Announcement posted!', data: {}});
                    } else {
                        res.status(401).json({status: RESPONSE_TYPE.FAILED,
                            message: 'Unable to post announcement', data: {}});
                    }
                } catch(e) {
                    logger.log({
                        level: 'error',
                        message: e
                    })

                    res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});
                }
            });
        } catch(e) {
            logger.log({
                level: 'error',
                message: e
            })

            res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});
        }
    }
}