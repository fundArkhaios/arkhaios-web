const { client } = require("../plaid_configs");
const database = require("../../util/db");
const { forward } = require("../aes");
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

const processorToken = require('./generate-processor-token')

//https://plaid.com/docs/api/tokens/#itempublic_tokenexchange
module.exports = {
  route: "/api/plaid/public-token-exchange",
  //because authenticate returns the user object, since the frontend receives this object, we should not
  //store sensitive information in this collection
  authenticate: true,
  //pre-condition: req body needs to contain the public token and metadata after successful link completion
  //post-condition: On successful exchange, success message is returned. Error message otherwise
  post: async function (req, res, user) {
    var response = "";

    //this exchanges the public token for an access token through Plaid
    const public_token = req.body.public_token;
    const pubResponse = await client.itemPublicTokenExchange({public_token: public_token});

    if(pubResponse.data.error_code)
      return res.status(400).json({status: RESPONSE_TYPE.FAILED, message: "access token not generated", data: ""});

    console.log(pubResponse);

    //this encrypts the access token
    const access_token = await forward(pubResponse.data.access_token);

    //this reads the metadata and grabs the institution and accounts objects included
    var metadata = req.body.metadata;
    var institution = metadata.institution;
    var accounts = metadata.accounts;
  
    var accountObject = [];

    //creates an account object in order to store in the database
    for(let i = 0; i < accounts.length; i++){
      accountObject[i] = 
      {
        institution_name: institution.name,
        institution_id : institution.id,
        name: accounts[i].name,
        mask: accounts[i].mask,
        subtype: accounts[i].subtype
      }
    }

    try{
      //connect to the database
      await database.connect(async (db) => {
        //see if the user exists in Users collection
        var result = await db.collection('Users').findOne({accountID: user.accountID});

        if(result){
          //store the bank account info in the Users collection considering it is not
          //particularly sensitive

          await database.updateUser(user, {
            bank_accounts: accountObject,
          }, "$push");

          //create a new collection called Banks if it doesnt exist already
          //store the access tokens and all sensitive information here in this collection
          await db.collection('Banks').updateOne(
            { "accountID" : user.accountID },
            { $set: 
              {
                access_tokens: { [`${institution.name}`] : access_token }
              }
            },
            { 
              upsert: true 
            }
          )

          await processorToken.generate(db, user, metadata.account_id, institution.name);

          response = RESPONSE_TYPE.SUCCESS;

          res.status(201).json({status: response, message: `${institution.name} linked`, data: ""})
        }
        else{
          //database couldn't find user
          SERVER_ERROR(res);
        }
      });
    }
    catch(e){
      //couldn't connect to database
      SERVER_ERROR(res);
    }
  },
};
