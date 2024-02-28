const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type.js')
const alpaca = require('../external/alpaca/api.js');

module.exports = {
    route: '/api/account/create-ach-relationship',
    kyc: true,
    post: async function(req, res, user) {
        const { response, status } = await alpaca.create_ach_relationship(user.brokerageID,
            { processor_token: req.body.processor_token });

        if(status == 200) {
            res.status(200).send({status: RESPONSE_TYPE.SUCCESS, message: '', data: response});
        } else {
            SERVER_ERROR(res)
        }
    }
}