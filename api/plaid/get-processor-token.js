const { backward } = require('../aes');

module.exports = {
    route: '/api/plaid/get-processor-token',
    authenticate: true,
    get: async function (req, res, user){
        var processor_token = await backward(user.processor_token);

        res.status(200).json({token: processor_token});
    }
}
