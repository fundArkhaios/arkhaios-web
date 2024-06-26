const db = require('../../util/db');
const logger = require('../../util/logger');
const alpaca = require('../external/alpaca/api');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

module.exports = {
    route: "/api/positions",
    kyc: true,
    get: async function(req, res, user) {
        res.setHeader('Content-Type', 'application/json');
        
        const symbol = req.query?.symbol;

        if(req.query?.fund) {
            try {
                await db.connect(async (db) => {
                    fund = await db.collection('FundPositions').findOne({"fundID": req.query.fund});
                    if(fund) {
                        console.log("Fund: " + fund);
                        
                        let list = fund.positions;
                        
                        let returningArr = []
                        if(symbol) {
                            let res = [];

                            const keys = Object.keys(list);
                            for(let i in keys) {
                                const key = keys[i];
                                if(key == symbol) {
                                    res.push(list[key]);
                                }
                            }

                            returningArr = res;
                        } else {
                            let res = [];

                            const keys = Object.keys(list);
                            for(let i in keys) {
                                const key = keys[i];
                                console.log("Key: " + key);
                                res.push(list[key]);
                            }
                            returningArr = res;
                        }
                        console.log("returningArr: " + returningArr)
                        
                        if (req.query?.custom == "true") returningArr = fund.positions;


                        res.status(200).json({ status: RESPONSE_TYPE.SUCCESS, message: "", data: returningArr});
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
        } else {
            if (!symbol) {
                const { response, status } = await alpaca.get_positions(user.brokerageID);

                if(status == 200) {
                    res.send(JSON.stringify({status: RESPONSE_TYPE.SUCCESS, data: response}));
                } else {
                    SERVER_ERROR(res)
                }
                
            } else {
                const { response, status } = await alpaca.get_positions_symbol(user.brokerageID, symbol);
                
                if(status == 200) {
                    res.send(JSON.stringify({status: RESPONSE_TYPE.SUCCESS, data: response}));
                } else {
                    SERVER_ERROR(res)
                }
            }
        }
    }
}