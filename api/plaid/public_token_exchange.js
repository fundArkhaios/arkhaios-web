const { client } = require("../plaid_configs");
const db = require("../../util/db");
const { forward } = require("../aes");
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

module.exports = {
  route: "/api/plaid/public-token-exchange",
  authenticate: true,
  post: async function (req, res, user) {
    var response = "";

    const public_token = req.public_token;
    const pubResponse = await client.itemPublicTokenExchange({public_token: public_token});

    const access_token = await forward(pubResponse.data.access_token);

    var metadata = req.body.metadata;
    var institution = metadata.institution;
    var accounts = metadata.accounts;
  
    var accountObject = {};

    for(let i = 0; i < accounts.length; i++){
      accountObject[accounts[i].id] = accounts[i].subtype;
    }

    try{
      await db.connect(async (db) => {
        var result = await db.collection('Users').findOne({email: user.email});

        if(result){
          await db.collection('Users').updateOne(
            { "accountID": user.accountID },
            { $set: 
              {
                access_tokens: { [`${institution.name}`] : access_token },
                institutions: 
                {
                  [`${institution.name}`] : 
                  {
                    id: [`${institution.id}`],
                    accounts: accountObject
                  }
                }
              },
              $push:
              {
                institution_names: [`${institution.name}`]
              }
            }
          );

          response = RESPONSE_TYPE.SUCCESS;

          res.status(201).json({status: response, message: `${accounts.name} linked`, data: ""})
        }
        else{
          SERVER_ERROR(res);
        }
      });
    }
    catch(e){
      SERVER_ERROR(res);
    }
  },
};
