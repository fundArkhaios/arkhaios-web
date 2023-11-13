const alpaca = require('../api/alpaca/api');

module.exports = {
    method: "POST",
    route: "/api/place-order",
    authenticate: true,
    api: async function(req, res, user) {
        const scope = req.body.scope;
        if(scope.indexOf("F") != -1) {
            // TODO: Handle a fund order
            const id = scope.substring(scope.indexOf("F") + 1);
        } else {
            const data = {
                symbol: req.body.symbol,
                side: req.body.side,
                type: req.body.type,
                time_in_force: "gtc"
            };

            if(data.type == "limit") {
                data.limit_price = req.body.price;
            }

            if(req.body.transaction == "shares") {
                data.qty = req.body.qty;
            } else data.notional = req.body.qty;

            const response = await alpaca.create_order(user.account, data);

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(response));
        }
    }
}