const { client } = require('../plaid_configs');
const db = require('../../util/db');
const { forward, backward } = require('../aes');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

//https://plaid.com/docs/api/processors/#processortokencreate
module.exports = {
    route: '/api/plaid/generate-processor-token',
    authenticate: true,
    //pre-condition: in the request body, I need the institution name that the user is connecting
    //post-condition: if the generation is successful, return success message. Return error otherwise
    get: async function (req, res, user){
        var response = "";

        //this takes the user's access token and decrypts it
        var inst_name = req.body.institution_name;
        var accessToken = "";

        try{
            await db.connect(async (db) => {
                //try to see if the user exists in the Users collection
                let result = await db.collection('Users').findOne({accountID: user.accountID});

                //User exists
                if(result){
                    //grab their access token from the Banks collection
                    let temp = await db.collection('Banks').findOne({accountID: user.accountID}).access_tokens[inst_name];


                    //decryption
                    accessToken = await backward(temp);
                }
            });
        }
        catch(e){
            SERVER_ERROR(res);
            return res;
        }

        //access token is specific to institution
        //account_id refers to their unique Plaid ID that we generated on registration
        //processor is the payment processor
        var request = {
            access_token: accessToken,
            account_id: user.plaidID,
            processor: 'alpaca',
        }

        try{
            //call the processor token endpoint from Plaid with the request object
            const processResponse = await client.processorTokenCreate(request);

            //encrypt the processor token
            var encryptProcessorToken = await forward(processResponse.data.processor_token);

            //if there was a response, connect to the database and store the processor token for later use
            if(processResponse){
                await db.connect(async (db) => {
                    //check once again for the user in Users collection
                    let results = await db.collection('Users').findOne({accountID: user.accountID});

                    if(results){
                        //store it within the Banks collection, alongside access tokens
                        //we are storing it by institution name (similar to access token)
                        await db.collection('Banks').updateOne(
                            {"accountID": user.accountID},
                            { $set: 
                                {
                                    processor_tokens: { [`${inst_name}`] : encryptProcessorToken }
                                }
                            },
                            {
                                upsert: true
                            }
                        );

                        const { alpacaResponse, alpacaStatus } = await alpaca.create_ach_relationship(user.brokerageID,
                            { processor_token: processResponse.data.processor_token });

                        response = RESPONSE_TYPE.SUCCESS;

                        res.status(201).json({status: response, message: "Processor token created", data: ""});
                    }
                    else{
                        SERVER_ERROR(res);
                    }
                });
            }
            else{
                response = RESPONSE_TYPE.FAILED;
                res.status(406).json({status: response, message: "Error generating processor token", data: processResponse.error_type});
            }
        }
        catch(e){
            SERVER_ERROR(res);
            return res;
        }
    }
}
