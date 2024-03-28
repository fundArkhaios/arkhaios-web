const db = require('../../util/db.js');
const { RESPONSE_TYPE } = require('../response_type.js')

const { logger } = require('../../util/logger')

module.exports = {
    route: '/api/fund/list',
    kyc: true,
    get: async function(req, res, user) {
        try {
            await db.connect(async (db) => {
                try {
                    funds = await db.collection('FundPortfolios').find({
                        $or: [
                            {"members": user.accountID},
                            {"portfolioManagers": user.accountID}
                        ]}).toArray();
                    
                    let data = [];

                    for(let i in funds) {
                        data.push({
                            id: funds[i].fundID,
                            name: funds[i].fundName,
                            role: funds[i].portfolioManagers.includes(user.accountID) ? "manager" : "investor"
                        });
                    }

                    res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: "", data: {funds: data}});
                } catch(e) {
                    logger.log({
                        level: 'error',
                        message: e
                    })
                }
            });
        } catch(e) {
            res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});

            logger.log({
                level: 'error',
                message: e
            })
        }
    }
}