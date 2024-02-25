const alpaca = require('../external/alpaca/api');
const assetIds = {};
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type');

async function fetchYahoo(id) {
    const baseURL = 'https://query1.finance.yahoo.com';
    const path = '/v8/finance/chart/' + id;
    const query = '?region=US&lang=en-US&interval=2m&range=1d';
    console.log(baseURL + path + query);
    const response = await fetch(baseURL + path + query);

    return response;
}

module.exports = {
    route: "/api/quote",
    authenticate: true,
    get: async function(req, res, user) {
        res.setHeader('Content-Type', 'application/json');
        const symbol = req.query.id.toUpperCase();

        const quote = await fetchYahoo(symbol);
        if(quote.status == 200) {
            const json = await quote.json();
            
            res.status(200).json({
                status: RESPONSE_TYPE.SUCCESS,
                data: {
                    symbol: symbol,
                    price: json['chart']['result']['0']['meta']['regularMarketPrice']
                }
            })

            return;
        } else {
            // Alpaca fallback:
            // From /asset API documentation regarding (lastPrice) data:
            // NOTE: This field is currently in this spec however it may not be
            // present in the production environment at time of publishing.
            // It will be coming in a future update at which point this spec should be updated.
            
            if(!(symbol in assetIds)) {
                // Retrieve asset ids that are not yet stored 
                const assets = await alpaca.get_assets();
                for(let i = 0; i < assets.length; ++i) {
                    const asset = assets[i].symbol.toUpperCase();
                    assetIds[assets[i].symbol] = assets[i].id;
                    if(asset == symbol) {
                        res.status(200).json({
                            status: RESPONSE_TYPE.SUCCESS,
                            data: {
                                symbol: asset.symbol,
                                price: assets[i].lastPrice
                            }
                        })

                        return;
                    }
                }
            } else {
                const id = assetIds[symbol];
                const asset = await alpaca.get_asset(id);
                if(asset?.lastPrice) {
                    res.status(200).json({
                        status: RESPONSE_TYPE.SUCCESS,
                        data: {
                            symbol: asset.symbol,
                            price: assets[i].lastPrice
                        }
                    })
                    
                    return;
                }
            }

            res.status(500).json({status: RESPONSE_TYPE.ERROR, message: 'symbol not found'});
        }
    }
}