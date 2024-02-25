const alpaca = require('../external/alpaca/api');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

module.exports = {
    route: "/api/cancel-order",
    kyc: true,
    post: async function(req, res, user) {
        res.setHeader('Content-Type', 'application/json');

        if(!req.body.order) {
            res.status(200).json({ status: RESPONSE_TYPE.FAILED, message: "order id required"});
        } else {
            const { response, status } = await alpaca.cancel_order(user.brokerageID, req.body.order);

            if(status == 200) {
                res.status(200).json({ status: RESPONSE_TYPE.SUCCESS, message: "", data: response});
            } else {
                SERVER_ERROR(res)
            }
        }
    }
}