const alpaca = require('../external/alpaca/api');

module.exports = {
    route: "/api/account-status",
    authenticate: true,
    get: async function(req, res, user) {
        const data = await alpaca.account_status(user.brokerageID);
      
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
    }
}