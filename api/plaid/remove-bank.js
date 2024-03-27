const { client } = require('../plaid_configs');
const db = require('../../util/db');
const { backward } = require('../aes');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

//https://plaid.com/docs/api/items/#item-remove-request-client-id
module.exports = {
    route: '/api/plaid/remove-bank',
    authenticate: true,
    //pre-condition: req body needs to contain the institution_name
    //post-condition: 
    post: async function(req, res, user){
        var response = "";

        var accessToken = "";
        var institution_name = req.institution_name;

        //we need to connect to the database in order to retrieve and decrypt the access token
        try{
            await db.connect(async (db) => {
                let results = await db.collection('Banks').findOne({accountID: user.accountID}).access_tokens[institution_name];

                if(results)
                    accessToken = await backward(results);
                else
                    accessToken = "error";
            });
        }
        catch(e){
            SERVER_ERROR(res);
            return res;
        }

        if(accessToken == "error")
            return res.status(406).json({status: RESPONSE_TYPE.FAILED, message: "access token was not retrieved", data: ""});

        //create request object, we only need an access token here. 
        const request = {
            access_token: accessToken
        }

        //SIDE NOTE, when we are deleting a user in OUR database, we check to see if they have positions
        //should we do that here as well? How should we handle that?
        //My thoughts are as follows:
        //If user has positions:
            //if user has more than one bank account:
                //if we can transfer to that bank account:
                    //delete the bank account they are trying to remove
                //else:
                    //ask them to sell all of their positions to be able to transfer the money to their account, and try
                    //to delete the account afterwards
            //else:
                //ask user to sell all of their positions and try to delete the account afterwards
        //else:
            //delete the bank account
        
        try{
            //call the Plaid endpoint for removing an item (should remove ALL of their accounts, not just one)
            var delResponse = await client.itemRemove(request);

            if(!delResponse)
                res.status(500).json({error: "Something went wrong"});

            //remove their access token from the database, it should be invalid
            await db.connect(async (db) => {
                let results = await db.collection('Users').findOne(user);

                if(results){
                    await db.collection('Users').updateOne(user,
                        {$unset: {"plaidAccess": ""}}
                    );
                }
            });
        }
        catch(err){
            error = err.toString();
        }

        res.status(200).json({flag: "Success! Bank Account deleted."});
    }
}
