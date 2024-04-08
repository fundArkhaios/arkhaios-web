const alpaca = require('../external/alpaca/api');
const assetIds = {};
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

// finnhub.io/docs/api/company-basic-financials
async function getCompanyFinancials(symbol) {
    try {
        const response = await fetch("https://finnhub.io/api/v1/stock/metric?symbol=" + symbol + "&metric=all&token=" + process.env.FINNHUB_API_KEY);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching company financials:', error);
        throw error; // Rethrow error to be handled by the caller
    }
}

module.exports = {
    route: "/api/company-financials",
    authenticate: true,
    get: async function(req, res, user) {
        res.setHeader('Content-Type', 'application/json');

        const symbol = req.query.symbol;

        console.log("Company Financials API Hit");

        if (!symbol) {
            return res.status(400).send({
                status: RESPONSE_TYPE.FAILED,
                message: 'Symbol query parameter is required',
                data: []
            });
        }


        try {
            const responseJSON = await getCompanyFinancials(symbol);
            console.log("Company Financials API Response:", responseJSON);

            if (responseJSON && Object.keys(responseJSON).length > 0) {
                res.status(200).send({
                    status: RESPONSE_TYPE.SUCCESS,
                    message: '',
                    data: responseJSON
                });
            } else {
                // Response JSON is null or empty
                res.status(204).send({
                    status: RESPONSE_TYPE.FAILED,
                    message: 'No company financials available.',
                    data: []
                });
            }
          } catch (error) {
            // Error during fetch request
            console.log(error);
            SERVER_ERROR(res, error);
          }
    }
}