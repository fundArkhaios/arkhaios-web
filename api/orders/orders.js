const db = require('../../util/db');
const logger = require('../../util/logger');
const alpaca = require('../external/alpaca/api');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

module.exports = {
    route: "/api/orders",
    kyc: true,
    get: async function(req, res, user) {
        res.setHeader('Content-Type', 'application/json');

        let lookup = user.brokerageID;
        if(req.body.fund) {
            lookup = process.env.FIRM_ACCOUNT;
            if(!user.fundsManaging.includes(req.body.fund)) {
                res.status(401).json({ status: RESPONSE_TYPE.FAILED, message: "unauthorized", data: []});
            }
        }

        const { response, status } = await alpaca.get_orders(lookup, req.body.status || "all");
        
        if(status == 200) {
            if(req.body.fund) {
                try {
                    await db.connect(async (db) => {
                        fund = await db.collection('FundOrders').findOne({"fundID": req.body.fund});
                        if(fund) {
                            const list = response.filter((order) => fund.orders.includes(order.id));
                            
                            res.status(200).json({ status: RESPONSE_TYPE.SUCCESS, message: "", data: list});
                        } else {
                            res.status(401).json({ status: RESPONSE_TYPE.FAILED, message: "server error", data: []});
                        }
                    });
                } catch(e) {
                    logger.log({
                        level: 'error',
                        message: e
                    })

                    return SERVER_ERROR(res);
                }
            } else res.status(200).json({ status: RESPONSE_TYPE.SUCCESS, message: "", data: response});
        } else {
            SERVER_ERROR(res)
        }
    }
}