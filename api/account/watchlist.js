const db = require('../../util/db');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');
const { logger } = require('../../util/logger')

module.exports = {
    route: "/api/watchlist",
    authenticate: true,
    unverified: true,
    post: async function(req, res, user) {
        // Toggle to watchlist (add or remove)
        let symbol = req.body.symbol;

        if(!symbol) {
            res.status(400).json({status: RESPONSE_TYPE.FAILED, message: "symbol expected"})
            return
        }

        try {
            await db.connect(async (db) => {
                try {
                    const result = await db.collection('Watchlist').findOne({user: user.accountID})
                    if(result?.watchlist) {
                        if(result.watchlist.includes(symbol)) {
                            // Remove from watchlist if already included
                                await db.collection('Watchlist').updateOne({user: user.accountID},
                                    { $set: { watchlist: result.watchlist.filter(item => { return item != symbol } )}});

                            res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: "symbol removed from watchlist"})
                        } else {
                            // Add to watchlist if not include
                            await db.collection('Watchlist').updateOne({user: user.accountID},
                                { $push: { watchlist: symbol }});

                            res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: "symbol added to watchlist"})
                        }
                    } else {
                        await db.collection('Watchlist').insertOne({
                            user: user.accountID,
                            watchlist: [symbol]
                        })

                        res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: "symbol added to watchlist"})
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
    },

    get: async function(req, res, user) {
        try {
            await db.connect(async (db) => {
                try {
                    const result = await db.collection('Watchlist').findOne({user: user.accountID})
                    if(result?.watchlist) {
                        res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: "", data: result.watchlist})
                    } else {
                        // Watchlist does not yet exist (nothing added yet)
                        res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: "", data: []})
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