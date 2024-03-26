const alpaca = require('../external/alpaca/api');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

module.exports = {
    route: "/api/positions",
    kyc: true,
    get: async function(req, res, user) {
        res.setHeader('Content-Type', 'application/json');
        
        const symbol = req.query?.symbol;

        if (!symbol) {
            const { response, status } = await alpaca.get_positions(user.brokerageID);

            if(status == 200) {
                res.send(JSON.stringify({status: RESPONSE_TYPE.SUCCESS, data: response}));
            } else {
                SERVER_ERROR(res)
            }
            
        } else {
            const { response, status } = await alpaca.get_positions_symbol(user.brokerageID, symbol);
            
            if(status == 200) {
                res.send(JSON.stringify({status: RESPONSE_TYPE.SUCCESS, data: response}));
            } else {
                SERVER_ERROR(res)
            }
        }
    }
}