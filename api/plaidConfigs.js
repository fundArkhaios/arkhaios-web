const { Configuration, PlaidAPI, PlaidEnvironments} = require('plaid');

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENTID,
            'PLAID_SECRET': process.env.PLAID_SANDBOX
        },
    },
});

const client = new PlaidAPI(configuration);
//This needs to be changed to the arkhaios homepage. This is where the OAuth redirects to when they 
//are finished authenticating the link token. Store it in the .env file, as well as configure it in the Plaid dashboard
const PLAID_REDIRECT_URI = '';

const configs = {
    user: {
        client_user_id: usr.salt,
    },
    client_name: 'Arkhaios',
    products: '',
    language: 'en',
};

if(PLAID_REDIRECT_URI !== '')
    configs.redirect_uri = PLAID_REDIRECT_URI;

module.exports = {
    client, 
    configs
}