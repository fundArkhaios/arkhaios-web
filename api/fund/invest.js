const db = require('../../util/db.js');
const logger = require('../../util/logger.js');
const alpaca = require('../external/alpaca/api.js');
const { RESPONSE_TYPE } = require('../response_type.js')

module.exports = {
    route: '/api/fund/invest',
    kyc: true,
    post: async function(req, res, user) {
        let error = '';

        try {
            let fund = null;
            const { fundID, amount } = req.body;

            await db.connect(async (db) => {
                try {
                    fund = await db.collection('FundPortfolios').findOne({fundID: fundID});
                    console.log(fund);
                    if(!fund) error = 'invalid fund';
                } catch(e) {
                    res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});
                    return;
                }
            });

            if(fund) {
                if(!fund.members?.includes(user.accountID)) {
                    return res.status(401).json({status: RESPONSE_TYPE.FAILED, message: 'You are not a member of this fund!'});
                }

                if(!fund.fundRecruiting || Math.floor(Date.now() / 1000) > fund.recruitEnd) {
                    return res.status(401).json({status: RESPONSE_TYPE.FAILED, message: 'Fund is not recruiting!'});
                }

                const { response, status } = await alpaca.get_trading_details(user.brokerageID);
                console.log("get trade details");
                if(status == 200) {
                    console.log("got buyin gpower");
                    const equity = response.buying_power;

                    const validInvestment = parseFloat(equity) >= amount;
                    if(validInvestment) {
                        if(process.env.FIRM_ACCOUNT) {
                            // Issue a journal to the firm account
                            const data = {
                                to: process.env.FIRM_ACCOUNT,
                                from: user.brokerageID,
                                amount: amount,
                            };

                            console.log("firm: ");
                            console.log(data);
                    
                            const { response, status } = await alpaca.create_journal(data);

                            if(status == 200) {
                                switch(response.status) {
                                    case 'pending':
                                    case 'executed':
                                    case 'queued':
                                        await db.connect(async (db) => {
                                            try {
                                                await db.collection('FundPortfolios').updateOne({
                                                    fundID: fundID,
                                                }, {$addToSet: { inJournals: response.id }});

                                                res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: 'investment transfer initiated'});
                                            } catch(e) {
                                                res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});
                                            }
                                        });

                                        break;
                                    case 'canceled':
                                    case 'rejected':
                                    case 'deleted':
                                        res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: 'transfer failed'});
                                        break;
                                }
                            } else {
                                res.status(401).json({status: RESPONSE_TYPE.ERROR, message: ""});
                            }
                        } else {
                            res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});
                            logger.log({
                                level: 'error',
                                message: "firm account not specified!"
                            })
                        }
                    } else {
                        res.status(401).json({status: RESPONSE_TYPE.FAILED, message: 'Insufficient funds to invest'});
                    }
                } else {
                    res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});
                }
            } else {
                res.status(401).json({status: RESPONSE_TYPE.FAILED, message: "Invalid fund"})
            }
        } catch(e) {
            res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});

            logger.log({
                level: 'error',
                message: e
            })
        }
    }
}