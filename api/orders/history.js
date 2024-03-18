const db = require('../../util/db');
const alpaca = require('../external/alpaca/api');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

module.exports = {
    route: "/api/history",
    kyc: true,
    post: async function(req, res, user) {
        res.setHeader('Content-Type', 'application/json');
        
        const period = req.body.period;
        const timeframe = req.body.timeframe;

        if(!period || !timeframe) {
            res.status(400).send({status: RESPONSE_TYPE.FAILED, message: 'invalid period/timeframe'});
            return;
        }

        const expiration = ((period, timeframe) => {
            if(period == '1D' && timeframe == '1Min') return 60;
            else if(period == '1W' && timeframe == '5Min') return 150;
            else if(period == '1M' && timeframe == '1D') return 3600;
            else if(period == '6M' && timeframe == '1D') return 3600;

            return -1;
        })(period, timeframe);

        db.redis.get(`portfolio:${user.brokerageID}:${period}:${timeframe}`).then(async (data) => {
            if(data) {
                res.status(200).send({status: RESPONSE_TYPE.SUCCESS, data: {history: JSON.parse(data) }});
            } else {
                const { response, status } = await alpaca.get_portfolio(user.brokerageID, period, timeframe);
                
                if(status == 200) {
                    let equity = response["equity"]

                    data = {}

                    data["timestamp"] = response["timestamp"];

                    data["equity"] = equity;

                    let base_value = 0.0;

                    data["profit_loss"] = [];
                    data["profit_loss_pct"] = [];

                    for(let i = 0; i < equity.length; ++i) {
                        if(base_value == 0) {
                            if(equity[i] != 0) {
                                base_value = equity[i];
                            }

                            data["profit_loss"].push(0);
                            data["profit_loss_pct"].push(0.00);
                        } else {
                            data["profit_loss"].push(equity[i] - base_value);
                            data["profit_loss_pct"].push((equity[i] / base_value - 1.0) * 100);
                        }
                    }

                    if(expiration >= 0) {
                        // Only cache calls relevant for displaying charts
                        db.redis.setEx(`portfolio:${user.brokerageID}:${period}:${timeframe}`, expiration, JSON.stringify(data));
                    }
                    
                    res.status(200).send({status: RESPONSE_TYPE.SUCCESS, data: { history: data }});
                } else {
                    SERVER_ERROR(res)
                }
            }
        });
    }
}