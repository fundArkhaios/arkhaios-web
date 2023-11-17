const alpaca = require('../external/alpaca/api');

module.exports = {
    route: "/api/orders",
    kyc: true,
    get: async function(req, res, user) {
        res.setHeader('Content-Type', 'application/json');

        const response = await alpaca.get_orders(user.brokerageID);

        res.send(JSON.stringify({response}));
    }
}