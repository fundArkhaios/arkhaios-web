const RESPONSE_TYPE = require('../response_type.js')
const alpaca = require('../external/alpaca/api.js');

module.exports = {
    route: '/api/sandbox-deposit',
    kyc: true,
    post: async function(req, res, user) {
        const response = await alpaca.sandbox_deposit(user.brokerageID, "500000");

        console.log(response);

        res.status(200).send({status: RESPONSE_TYPE.SUCCESS, message: 'deposit successful?', data: response});
    }
}