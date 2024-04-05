const db = require('../../util/db.js');
const { logger } = require('../../util/logger')
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

module.exports = {
    route: "/api/fund/balance",
    kyc: true,
    get: async function(req, res, user) {
        const fundID = req.query.fund;
        let fundAuthorized = false;
        let fund = null;

        if(fundID) {
            try {
                await db.connect(async (db) => {
                    fund = await db.collection('FundPortfolios').findOne({"fundID": fundID});
                    if(fund) {
                        if(fund.portfolioManagers.includes(user.accountID)) {
                            fundAuthorized = true;
                        } else {
                            res.status(401).json({ status: RESPONSE_TYPE.FAILED, message: "unauthorized", data: response});
                        }
                    } else {
                        res.status(401).json({ status: RESPONSE_TYPE.FAILED, message: "unauthorized", data: response});
                    }
                });
            } catch(e) {
                logger.log({
                    level: 'error',
                    message: e
                })

                return SERVER_ERROR(res);
            }
            
            if(fund && fundAuthorized) {
                return res.status(200).json({ status: RESPONSE_TYPE.SUCCESS,
                    message: "", data: { balance: fund.availableBalance }});
            }
        }
    }
}