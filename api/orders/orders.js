const alpaca = require('../external/alpaca/api');

module.exports = {
    route: "/api/orders",
    authenticate: true,
    get: async function(req, res, user) {
        res.setHeader('Content-Type', 'application/json');

        if(user.account) {
            const response = await alpaca.get_orders(user.account);

            res.send(JSON.stringify({response}));
        } else {
            res.send(JSON.stringify({error: "unauthorized for trading"}));
        }
    }
}