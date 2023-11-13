const alpaca = require('../api/alpaca/api');

module.exports = {
    method: "POST",
    route: "/api/cancel-order",
    authenticate: true,
    api: async function(req, res, user) {
        res.setHeader('Content-Type', 'application/json');

        if(!req.body.order) {
            res.send(JSON.stringify({error: "order id required"}));
        } else {
            const response = await alpaca.cancel_order(user.account, req.body.order);

            res.send(JSON.stringify(response));
        }
    }
}