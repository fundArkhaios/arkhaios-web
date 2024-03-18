const { client } = require('../plaid_configs');

module.exports = {
    route: '/api/plaid/generate-link-token',
    authenticate: true,
    get: async function (req, res, user){
        //create an object to send to Plaid, these are the required options, but 
        //the other options that you can include are found the in Plaid Docs
        const configs = {
            user: {
                client_user_id: user.plaidID,
            },
            country_codes: ['US'],
            client_name: 'Arkhaios',
            products: ['auth'],
            language: 'en'
        };

        //this calls Plaid's API endpoint
        var tokenResponse = await client.linkTokenCreate(configs);

        //send this to the frontend so they can display the link initialization.
        res.status(201).json(tokenResponse.data);
    }
}
