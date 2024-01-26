const RESPONSE_TYPE = require('../response_type.js')
const alpaca = require('../external/alpaca/api.js');

module.exports = {
    route: '/api/create-ach-relationship',
    kyc: true,
    post: async function(req, res, user) {
        let data = {};
        data.account_owner_name = req.body.account_name;
        data.bank_account_type = req.body.checking ? "CHECKING" : "SAVINGS";
        data.bank_account_number = req.body.bank_number;
        data.bank_routing_number = req.body.routing_number;

        const response = await alpaca.create_ach_relationship(user.brokerageID, data);

        console.log("resp:");
        console.log(response);

        res.status(200).send({status: RESPONSE_TYPE.SUCCESS, message: '',
        data: response});
    }
}