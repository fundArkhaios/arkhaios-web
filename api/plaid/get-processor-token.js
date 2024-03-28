const { backward } = require('../aes');

module.exports = {
    //should be noted that this is not meant to be an endpoint. 
    //This should be an internal function used by other endpoints
    //I don't want the processor token to be passesd to the frontend in any way because that is not super secure
    get_processor_token: async function (institution_name, user){
        var processor_token = "";

        try{
            var response = await db.collection('Banks').findOne({accountID: user.accountID}).processor_tokens[institution_name];
            
            if(response)
                processor_token = await backward(response);
        }
        catch(e){
            processor_token = "error";
        }

        return processor_token;
    }
}
