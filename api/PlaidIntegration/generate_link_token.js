const { client } = require('../plaid_configs');

module.export = {
    route: '/PlaidIntegration/generate_link_token',
    method: GET,
    authenticate: true,
    get: async function (req, res, user){
        const configs = {
            usr: {
                client_user_id: user.id,
            },
            client_name: 'Arkhaios',
            products: ['auth'],
            language: 'en'
        };

        var tokenResponse = await client.linkTokenCreate(configs);

        res.status(201).json(tokenResponse);
    }
}
