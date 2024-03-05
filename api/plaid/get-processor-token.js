const { backward } = require('../aes');

module.exports = {
    //should be noted that this is not meant to be an endpoint. This should be an internal function used by other endpoints
    //I don't want the processor token to be passesd to the frontend in any way because that is not super secure
    get_processor_token: async function (user){
        var processor_token = await backward(user.processor_token);

        return processor_token;
    }
}
