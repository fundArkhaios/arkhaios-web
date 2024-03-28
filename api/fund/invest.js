const db = require('../../util/db.js');
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
                    if(!fund) error = 'invalid fund';
                } catch(e) {
                    res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});
                    return;
                }
            });

            if(fund) {
                const portfolio = await alpaca.get_portfolio(user.brokerageID, "1D", "1Min");
                const equity = portfolio[portfolio.length - 1];

                const validInvestment = parseFloat(equity) >= amount;
                if(validInvestment) {
                    if(process.env.FIRM_ACCOUNT) {
                        // Issue a journal to the firm account
                        const data = {
                            to: process.env.FIRM_ACCOUNT,
                            from: user.brokerageID,
                            amount: amount,
                        };
                
                        const { response, status } = await alpaca.create_journal(data);

                        if(status == 200) {
                            switch(response.status) {
                                case 'pending':
                                case 'executed':
                                case 'queued':
                                    res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: 'investment transfer initiated'});
                                    break;
                                case 'canceled':
                                case 'rejected':
                                case 'deleted':
                                    res.status(200).json({status: RESPONSE_TYPE.SUCCESS, message: 'transfer failed'});
                                    break;
                            }
                        }
                    } else {
                        res.status(401).json({status: RESPONSE_TYPE.ERROR, message: 'server error'});
                        logger.log({
                            level: 'error',
                            message: "firm account not specified!"
                        })
                    }
                } else {
                    res.status(401).json({status: RESPONSE_TYPE.FAILED, message: 'insufficient funds to invest'});
                }
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