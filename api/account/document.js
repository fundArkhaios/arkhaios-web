const alpaca = require('../external/alpaca/api.js');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type.js');

module.exports = {
    route: '/api/account/document',
    kyc: true,
    get: async function(req, res, user) {
        const { response, status } = await alpaca.get_document(user.brokerageID, req.query.id);

        res.setHeader('Content-Type', 'application/pdf');
        
        if(status == 200) {
            res.status(200).send(Buffer.from(response));
        } else {
            SERVER_ERROR(res)
        }
    }
}