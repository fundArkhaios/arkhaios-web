const alpaca = require('../external/alpaca/api');

module.exports = {
    route: "/api/history",
    kyc: true,
    post: async function(req, res, user) {

        // const data = {
        //     period: req.body.period, 
        //     timeframe: req.body.timeframe
        // }

        console.log("Inside get-history");
        const response = await alpaca.get_portfolio(user.brokerageID, req.body.period, req.body.timeframe);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(response));
    }
}