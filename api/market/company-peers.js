const alpaca = require('../external/alpaca/api');
const assetIds = {};
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

// https://finnhub.io/docs/api/company-peers
async function getCompanyPeers(symbol) {
    const response = await fetch(
        "https://finnhub.io/api/v1/stock/peers?symbol=" + symbol + "&token=" + process.env.FINNHUB_API_KEY
    );
      return await response.json();
}

module.exports = {
    route: "/api/company-peers",
    authenticate: true,
    get: async function(req, res, user) {
        res.setHeader('Content-Type', 'application/json');
        let symbol = req.query.symbol;

        try {
            const responseJSON = await getCompanyPeers(symbol);
            
            if (responseJSON && responseJSON.length > 0) {
                res.status(200).send({
                    status: RESPONSE_TYPE.SUCCESS,
                    message: '',
                    data: responseJSON
                });
            } else {
                // Response JSON is null or empty
                res.status(204).send({
                    status: RESPONSE_TYPE.FAILED,
                    message: 'No company peers available for the specified stock.',
                    data: []
                });
            }
          } catch (error) {
            // Error during fetch request
            SERVER_ERROR(res, error);
          }
    }
}