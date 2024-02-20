const db = require('../../util/db');
const alpaca = require('../external/alpaca/api');
const RESPONSE_TYPE = require('../response_type');

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
            else if(period == '1W' && timeframe == '5Min') return 3600;
            else if(period == '1M' && timeframe == '1D') return 3600 * 24;
            else if(period == '6M' && timeframe == '1D') return 3600 * 24;

            return -1;
        })(period, timeframe);

        db.redis.get(`portfolio:${user.brokerageID}`).then(async (data) => {
            if(data) {
                res.status(200).send({status: RESPONSE_TYPE.SUCCESS, data: {history: JSON.parse(data) }});
            } else {
                const response = await alpaca.get_portfolio(user.brokerageID, period, timeframe);
                if(expiration >= 0) {
                    // Only cache calls relevant for displaying charts
                    db.redis.setEx(`portfolio:${user.brokerageID}`, expiration, JSON.stringify(response));
                }
                
                res.status(200).send({status: RESPONSE_TYPE.SUCCESS, data: { history: response }});
            }
        });
    }
}