const { RESPONSE_TYPE, SERVER_ERROR } = require("../response_type");

async function getMarketNews(category) {
  const response = await fetch(
    "https://finnhub.io/api/v1/news?category=" +
      category +
      "&token=" +
      process.env.FINNHUB_API_KEY
  );
  return await response.json();
}

module.exports = {
  route: "/api/account/get-market-news",
  authenticate: true,
  get: async function (req, res, user) {
    let category = req.query.category;

    try {
      const responseJSON = await getMarketNews(category);
      if (responseJSON) {
        res.status(200).send({
          status: RESPONSE_TYPE.SUCCESS,
          message: "",
          data: responseJSON,
        });
      } else {
        // Response JSON is null or empty
        res.status(204).send({
          status: RESPONSE_TYPE.FAILED,
          message: "No news found for the given category.",
          data: null,
        });
      }
    } catch (error) {
      // Error during fetch request
      SERVER_ERROR(res, error);
    }
  },
};
