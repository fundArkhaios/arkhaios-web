const alpaca = require('../external/alpaca/api');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

module.exports = {
    route: "/api/account/equity",
    kyc: true,
    get: async function(req, res, user) {
        const { response, status } = await alpaca.get_portfolio(user.brokerageID, "1D", "1Min");
        
        res.setHeader('Content-Type', 'application/json'); 
        if(status == 200) {
            res.status(200).send({status: RESPONSE_TYPE.SUCCESS, data: {equity: response.equity[response.equity.length - 1]}});
        } else {
            SERVER_ERROR(res)
        }
    }
}