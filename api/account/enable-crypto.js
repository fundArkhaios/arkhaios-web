const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type.js')
const alpaca = require('../external/alpaca/api.js');

module.exports = {
    route: '/api/enable-crypto',
    kyc: true,
    post: async function(req, res, user) {
        const { response, status } = await alpaca.enable_crypto(user.brokerageID, req.ip);
        if(status == 200) {
            res.status(200).send({status: RESPONSE_TYPE.SUCCESS, message: 'crypto access requested', data: response});
        } else {
            SERVER_ERROR(res)
        }
    }
}