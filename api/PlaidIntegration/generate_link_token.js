const { client } = require('../plaid_configs');

module.export = {
    route: '/plaidIntegration/generate_link_token',
    method: GET,
    authenticate, true,
    get: async function (user){
        const configs = {
            usr: {
                client_user_salt: user.salt,
            },
            client_name: 'Arkhaios',
            products: ['auth'],
            language: 'en'
        };

        var tokenResponse = await client.linkTokenCreate(configs);

        res.status(201).json(tokenResponse);
    }
}