const { backward } = require('../aes');

module.exports = {
    route: '/api/PlaidIntegration/get_processor_token',
    method: GET,
    authenticate: true,
    get: async function (req, res, user){
        var processor_token = backward(user.processor_token);

        res.status(200).json({token: processor_token});
    }
}