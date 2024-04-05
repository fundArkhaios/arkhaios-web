const db = require('../../util/db.js');
const alpaca = require('../external/alpaca/api');
const { logger } = require('../../util/logger')
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');
const BigNumber = require('bignumber.js')

module.exports = {
    route: "/api/place-order",
    kyc: true,
    post: async function(req, res, user) {
        const fundID = req.body.fund;
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
            
            if(req.body.type != "limit") {
                return res.status(401).json({ status: RESPONSE_TYPE.FAILED,
                    message: "funds may only place limit orders", data: {}});
            }

            if(fund && fundAuthorized) {
                const availableBalance = new BigNumber(fund.availableBalance);
                const qty = new BigNumber(req.body.qty);
                const price = new BigNumber(req.body.price); 
            
                const difference = availableBalance.minus(price.times(qty));

                if(difference.isLessThanOrEqualTo(new BigNumber("0"))) {
                    return res.status(401).json({ status: RESPONSE_TYPE.FAILED,
                        message: "insufficient funds", data: {}});
                }
                
                fund.availableBalance = difference.toString();
            }
        }
        
        if(!fundID || fundAuthorized) {
            const data = {
                symbol: req.body.symbol,
                side: req.body.side,
                type: req.body.type,
                time_in_force: "gtc"
            };

            if(data.type == "limit") {
                data.limit_price = req.body.price;
            }

            if(req.body.transaction == "shares") {
                data.qty = req.body.qty;
            } else data.notional = req.body.qty;

            if(!process.env.FIRM_ACCOUNT && fundID && fundAuthorized) {
                logger.log({
                    level: 'error',
                    message: "firm account not specified!"
                })

                return SERVER_ERROR(res);
            }
            
            const { response, status } = await alpaca.create_order(
                !fundID ? user.brokerageID : process.env.FIRM_ACCOUNT, data);
      
            res.setHeader('Content-Type', 'application/json');

            if(status == 200) {
                if(fundID && fundAuthorized && response.id) {
                    try {
                        await db.connect(async (db) => {
                            await db.collection('FundOrders').updateOne({
                                fundID: fundID,
                            }, {$addToSet: { orders: response.id }}, { upsert: true });

                            await db.collection('FundPortfolios').updateOne({
                                fundID: fundID
                            }, {$set: { availableBalance: fund.availableBalance }});
                        });
                    } catch(e) {
                        logger.log({
                            level: 'error',
                            message: e
                        })

                        return SERVER_ERROR(res);
                    }
                }

                res.status(200).json({ status: RESPONSE_TYPE.SUCCESS, message: "", data: response});
            } else {
                if(response.message) {
                    res.status(500).json({ status: RESPONSE_TYPE.ERROR, message: response.message, data: response});
                } else {
                    SERVER_ERROR(res)
                }
            }
        }
    }
}