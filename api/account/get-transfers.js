const RESPONSE_TYPE = require('../response_type.js')
const alpaca = require('../external/alpaca/api.js');

module.exports = {
    route: '/api/get-transfers',
    kyc: true,
    get: async function(req, res, user) {
        const response = await alpaca.get_transfers(user.brokerageID);

        res.status(200).send({status: RESPONSE_TYPE.SUCCESS, message: '',
        data: response});
    }
}