const { client } = require("../plaid_configs");
const db = require("../../util/db");
const { forward } = require("../aes");

module.exports = {
  route: "/api/plaid/public-token-exchange",
  authenticate: true,
  post: async function (req, res, user) {
    //call the itemPublicTokenExchange endpoint from Plaid, this gives us the access token
    //public_token is given to use from the front end after the link completion.
    var response = await client.itemPublicTokenExchange({
      public_token: req.body.public_token,
    });
    
    var error = "";
    //encrypt both the access token and the "item_id"
    //item_id is the reference id for the user's individual account with Plaid. 
    var accessToken = await forward(response.data.access_token);
    var item_id = await forward(response.data.item_id);

    //store the stuff in the database
    try {
      await db.connect(async (db) => {
        try {
          let results = await db.collection("Users").findOne({email: user.email});
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
    } else {
      res.status(501).json({ flag: "failure", err: error });
    }
  },
};
