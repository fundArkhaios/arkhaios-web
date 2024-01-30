const alpaca = require('../external/alpaca/api.js');

module.exports = {
    route: '/api/document',
    kyc: true,
    get: async function(req, res, user) {
        const response = await alpaca.get_document(user.brokerageID, req.query.id);

        res.setHeader('Content-Type', 'application/pdf');
        res.status(200).send(Buffer.from(response));
    }
}