const RESPONSE_TYPE = require('../response_type.js')
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

        const response = await alpaca.create_transfer(user.brokerageID, data);

        res.status(200).send({status: RESPONSE_TYPE.SUCCESS, message: '',
        data: response});
    }
}