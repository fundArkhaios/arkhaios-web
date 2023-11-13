const alpaca = require('../api/alpaca/api');

module.exports = {
    method: "GET",
    route: "/api/orders",
    authenticate: true,
    api: async function(req, res, user) {
        const response = await alpaca.get_orders(user.account);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({response}));
    }
}