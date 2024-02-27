const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type.js')
const alpaca = require('../external/alpaca/api.js');

module.exports = {
    route: '/api/account/get-transfers',
    kyc: true,
    get: async function(req, res, user) {
        const { response, status } = await alpaca.get_transfers(user.brokerageID);

        if(status == 200) {
            res.status(200).send({
                status: RESPONSE_TYPE.SUCCESS,
                message: '',
                data: response
            });
        } else {
            SERVER_ERROR(res)
        }
    }
}