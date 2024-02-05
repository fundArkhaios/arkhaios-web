const alpaca = require('../external/alpaca/api');

module.exports = {
    route: "/api/positions",
    kyc: true,
    get: async function(req, res, user) {
        res.setHeader('Content-Type', 'application/json');
        
        const response = await alpaca.get_positions(user.brokerageID);

        res.send(JSON.stringify({response}));
    }
}