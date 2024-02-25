const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type.js')
const alpaca = require('../external/alpaca/api.js');

module.exports = {
    route: '/api/ach-deposit',
    kyc: true,
    post: async function(req, res, user) {
        let data = {
            transfer_type: "ach",
            relationship_id: req.body.relationship_id,
            amount: req.body.amount,
            direction: "INCOMING",
            timing: "immediate"
        };

        const { response, status } = await alpaca.create_transfer(user.brokerageID, data);

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