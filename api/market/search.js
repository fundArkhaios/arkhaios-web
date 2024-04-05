const db = require('../../util/db');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');
const { logger } = require('../../util/logger')

module.exports = {
    route: "/api/search",
    authenticate: true,
    get: async function(req, res, user) {
        res.setHeader('Content-Type', 'application/json');
        const query = req.query.query;

        let results = [];
        try {
            await db.connect(async (db) => {
                try {
                    if(query.startsWith("F:")) {
                        results = await db.collection('FundPortfolios')
                        .find({ "fundName": {"$regex": "(?i)^" + query.substring(2).trimStart() + ".*"}, "publiclyAvailable": true })
                        .limit(5).toArray();

                        results = results.map(result => {
                            return {
                                symbol: result.fundSymbol,
                                name: result.fundName,
                                exchange: "FUNDS"
                            }
                        });

                        res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: '', data: results});
                    } else {
                        results = await db.collection('Assets').
                            find({ "symbol": {"$regex": "(?i)^" + query + ".*"} })
                            .limit(5).toArray();

                        if(results.length < 5) {
                            // Two queries worst case;
                            // this makes it trivial to handle the sorting criteria, with more network traffic
                            results = results.concat(await db.collection('Assets').
                            find({ "name": {"$regex": "(?i)^" + query + ".*"} }).
                            limit(5 - results.length).toArray());
                        }

                        res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: '', data: results});
                    }
                } catch(e) {
                    logger.log({
                        level: 'error',
                        message: e
                    })
                }
            });
        } catch(e) {
            logger.log({
                level: 'error',
                message: e
            })
        }

        if(!res.headersSent) {
            SERVER_ERROR(res)
        }
    }
}
