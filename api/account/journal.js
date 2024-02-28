const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type.js')
const alpaca = require('../external/alpaca/api.js');

module.exports = {
    route: '/api/account/journal',
    kyc: true,
    post: async function(req, res, user) {
        const data = {
			to: req.body.to,
			from: user.brokerageID,
			amount: req.body.amount,
		};

        const { response, status } = await alpaca.create_journal(data);

        if(status == 200) {
            res.status(200).send({status: RESPONSE_TYPE.SUCCESS, message: '', data: response});
        } else {
            SERVER_ERROR(res)
        }
    }
}