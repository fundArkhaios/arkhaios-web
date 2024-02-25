const { client } = require('../plaid_configs');

module.exports = {
    route: '/api/plaid/generate-link-token',
    authenticate: true,
    get: async function (req, res, user){
        const configs = {
            user: {
                client_user_id: user.plaidID,
            },
            country_codes: ['US'],
            client_name: 'Arkhaios',
            products: ['auth'],
            language: 'en'
        };

        var tokenResponse = await client.linkTokenCreate(configs);

        res.status(201).json(tokenResponse.data);
    }
}
