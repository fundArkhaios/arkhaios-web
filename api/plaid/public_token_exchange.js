const { client } = require("../plaid_configs");
const db = require("../../util/db");
const { forward } = require("../aes");

module.exports = {
  route: "/api/plaid/public-token-exchange",
  authenticate: true,
  post: async function (req, res, user) {
    var response = await client.itemPublicTokenExchange({
      public_token: req.body.public_token,
    });
    
    var error = "";
    var accessToken = await forward(response.data.access_token);
    var item_id = await forward(response.data.item_id);
    
    try {
      await db.connect(async (db) => {
        try {
          let results = await db.collection("Users").findOne({email: user.email});
          console.log("hello");
          if (results) {
            // console.log(results);
            await db.collection("Users").updateOne({"email": user.email}, {
              $set: { plaidAccess: accessToken, plaidItem: item_id },
            });
          }
        } catch (e) {
          console.error(e);
        }
      });
    } catch (e) {
      error = e.toString();
    }

    if (!error) {
      res.status(201).json({ flag: "success" });
      console.log('good');
    } else {
      res.status(501).json({ flag: "failure", err: error });
      console.log('bad');
    }
  },
};
