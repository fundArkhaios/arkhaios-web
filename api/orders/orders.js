const alpaca = require('../external/alpaca/api');

module.exports = {
    route: "/api/orders",
    kyc: true,
    get: async function(req, res, user) {
        res.setHeader('Content-Type', 'application/json');

        let status = "all";
        if(req.body.status) status = req.body.status;

        const response = await alpaca.get_orders(user.brokerageID, status);
        
        res.send(JSON.stringify({response}));
    }
}