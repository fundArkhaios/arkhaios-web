const alpaca = require('../api/alpaca/api');

module.exports = {
    method: "GET",
    route: "/api/account-status",
    authenticate: true,
    api: async function(req, res, user) {
        const data = await alpaca.account_status(user.account);
      
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));
    }
}