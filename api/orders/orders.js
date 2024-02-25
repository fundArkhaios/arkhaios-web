const alpaca = require('../external/alpaca/api');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

module.exports = {
    route: "/api/orders",
    kyc: true,
    get: async function(req, res, user) {
        res.setHeader('Content-Type', 'application/json');

        const { response, status } = await alpaca.get_orders(user.brokerageID, req.body.status || "all");
        
        if(status == 200) {
            res.status(200).json({ status: RESPONSE_TYPE.SUCCESS, message: "", data: response});
        } else {
            SERVER_ERROR(res)
        }
    }
}