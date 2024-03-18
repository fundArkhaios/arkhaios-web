const { RESPONSE_TYPE, SERVER_ERROR } = require("../response_type");

async function get_News(symbol, startDate, endDate) {
  const response = await fetch(
    "https://finnhub.io/api/v1/company-news?symbol=" +
      symbol +
      "&from=" +
      startDate +
      "&to=" +
      endDate +
      "&token=" +
      process.env.FINNHUB_API_KEY
  );
  return await response.json();
}

module.exports = {
  route: "/api/account/get-stock-news",
  authenticate: true,
  get: async function (req, res, user) {
    let symbol = req.query.symbol;
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;
    
    try {
        const responseJSON = await get_News(symbol, startDate, endDate);
        
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
                message: 'No news data available for the specified parameters.',
                data: []
            });
        }
      } catch (error) {
        // Error during fetch request
        SERVER_ERROR(res, error);
      }
    
  },
};
