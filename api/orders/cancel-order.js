const alpaca = require('../external/alpaca/api');

module.exports = {
    route: "/api/cancel-order",
    authenticate: true,
    post: async function(req, res, user) {
        res.setHeader('Content-Type', 'application/json');

        if(!req.body.order) {
            res.send(JSON.stringify({error: "order id required"}));
        } else {
            const response = await alpaca.cancel_order(user.account, req.body.order);

            res.send(JSON.stringify(response));
        }
    }
}