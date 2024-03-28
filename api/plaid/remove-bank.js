const { client } = require('../plaid_configs');
const db = require('../../util/db');
const { backward } = require('../aes');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

//https://plaid.com/docs/api/items/#item-remove-request-client-id
module.exports = {
    route: '/api/plaid/remove-bank',
    authenticate: true,
    //pre-condition: institutionName needs to be passed in as a parameter
    //post-condition: If success, return success message. If error, return message with data when applicable
    post: async function(req, res, user, institutionName){
        var response = "";

        var accessToken = "";
        var institution_name = institutionName;

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

            if(delResponse.error)
                return res.status(500).json({status: RESPONSE_TYPE.FAILED, message: "could not remove token from Plaid", data: delResponse.error});

            //remove their access token from the database, it should be invalid
            await db.connect(async (db) => {
                let results = await db.collection('Users').findOne({accountID: user.accountID});

                if(results){
                    //delete the bank account from the Users collection array we have
                    await db.collection('Users').updateOne(
                        { "accountID": user.accountID },
                        { $pull: 
                            {
                                bank_accounts: 
                                {
                                    $in: [institution_name]
                                }
                            }
                        }
                    );

                    //Delete the access and processor tokens associated with that account
                    await db.collection('Banks').updateOne(
                        { "accountID" : user.accountID },
                        { $pull:
                            {
                                access_tokens: {$in: [institution_name]},
                                processor_tokens: {$in: [institution_name]}
                            }
                        }
                    );

                    response = RESPONSE_TYPE.SUCCESS;
                }
                else{
                    SERVER_ERROR(res);
                    return res;
                }
            });

            res.status(200).json({status: response, message: "account deleted successfully", data: ""});
        }
        catch(err){
            SERVER_ERROR(res);
        }
    }
}
