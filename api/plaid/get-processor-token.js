const { backward } = require('../aes');

module.exports = {
    get_processor_token: async function (user){
        var processor_token = backward(user.processor_token);

        return processor_token;
    }
}
