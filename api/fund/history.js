const logger = require('../../util/logger');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

module.exports = {
    route: "/api/fund/history",
    kyc: true,
    get: async function(req, res, user) {
        res.setHeader('Content-Type', 'application/json');
        
        const period = req.query.period;
        const symbol = req.query.symbol;

        if(!symbol) {
            return res.status(400).json({status: RESPONSE_TYPE.FAILED, message: "symbol required"});
        }

        if(period != "1d" && period != "1w" && period != "1m") {
            return res.status(400).json({status: RESPONSE_TYPE.FAILED, message: "invalid period type"});
        }

        try {
            fetch("http://18.218.219.131" + "/api/portfolio/" + symbol + "/" + period, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": btoa(user.email + ":" + user.sessionToken)
                }
            }).then(response => response.json()).then(data => {
                res.status(200).json(data);
            });
        } catch(e) {
            logger.log({
                level: 'error',
                message: e
            })

            SERVER_ERROR(res);
        }
    }
}