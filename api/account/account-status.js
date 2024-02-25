const alpaca = require('../external/alpaca/api');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type.js')

module.exports = {
    route: "/api/account-status",
    authenticate: true,
    get: async function(req, res, user) {
        const { response, status } = await alpaca.account_status(user.brokerageID);
      
        res.setHeader('Content-Type', 'application/json');

        if(status == 200) {
            res.status(200).json({status: RESPONSE_TYPE.SUCCESS, data: response });
        } else {
            SERVER_ERROR(res)
        }
    }
}