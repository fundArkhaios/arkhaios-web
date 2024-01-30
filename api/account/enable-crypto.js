const RESPONSE_TYPE = require('../response_type.js')
const alpaca = require('../external/alpaca/api.js');

module.exports = {
    route: '/api/enable-crypto',
    kyc: true,
    post: async function(req, res, user) {
        const response = await alpaca.enable_crypto(user.brokerageID, req.ip);
        res.status(200).send({status: RESPONSE_TYPE.SUCCESS, message: 'crypto enabled?', data: response});
    }
}