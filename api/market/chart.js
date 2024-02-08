const RESPONSE_TYPE = require("../response_type");

async function fetchYahoo(id, interval, range, afterHours) {
    const baseURL = 'https://query1.finance.yahoo.com';
    const path = '/v8/finance/chart/' + id;
    const query = '?region=US&lang=en-US&interval=' + interval + '&range=' + range
    + '&includePrePost=' + afterHours;

    const response = await fetch(baseURL + path + query);

    return response;
}

const ranges = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"];
const intervals = ["1m", "2m", "5m", "15m", "30m", "60m", "90m", "1h", "1d", "5d", "1wk", "1mo", "3mo"]

module.exports = {
    route: "/api/chart",
    authenticate: true,
    get: async function(req, res, user) {
        try {
            res.setHeader('Content-Type', 'application/json');
            const symbol = req.query?.symbol?.toUpperCase();

            if(!symbol) {
                // Symbol was not provided
                res.status(400).send(JSON.stringify({ status: RESPONSE_TYPE.FAILED, message: 'missing symbol'}));
                return;
            }

            // Ensure provided range and interval are validated
            const range = req.query?.range?.toLowerCase();
            const interval = req.query?.interval?.toLowerCase();
            if(!ranges.includes(range)) {
                res.status(400).send(JSON.stringify({ status: RESPONSE_TYPE.FAILED, message: 'invalid range'}));
                return;
            } else if(!intervals.includes(interval)) {
                res.status(400).send(JSON.stringify({ status: RESPONSE_TYPE.FAILED, message: 'invalid interval'}));
                return;
            }

            // Have after hours implicitly enabled by default, if not specified
            const afterHours = req.query?.afterHours?.toLowerCase() || 'true';

            if(afterHours != 'true' && afterHours != 'false') {
                res.status(400).send(JSON.stringify({ status: RESPONSE_TYPE.FAILED, message: 'invalid after hours parameter'}));
                return;
            }

            const history = await fetchYahoo(symbol, interval, range, afterHours);

            if(history.status == 200) {
                const json = await history.json();

                // Ensure expected parameters exist
                const object = json?.chart?.result?.['0'];

                // Extract timestamps and close arrays
                const timestamps = object?.timestamp;
                const closes = object?.indicators?.quote?.['0']?.close;

                // Ensure timestamps and close arrays are available
                if(timestamps && closes) {
                    // Respond with timestamp/close parallel arrays
                    res.status(200).send(JSON.stringify({
                        status: RESPONSE_TYPE.SUCCESS,
                        message: '',
                        data: {
                            timestamps: timestamps,
                            closes: closes,
                        }
                    }));
                } else {
                    // Unable to extract market data
                    res.status(500).send(JSON.stringify({
                        status: RESPONSE_TYPE.ERROR,
                        message: 'unable to retrieve market data'
                    }));
                }
            } else {
                // Request did not return a 200 status
                res.status(500).send(JSON.stringify({
                    status: RESPONSE_TYPE.ERROR,
                    message: 'unable to retrieve market data'
                }));
            }
        } catch(e) {
            // Some other exception was thrown
            res.status(500).send(JSON.stringify({ status: RESPONSE_TYPE.ERROR, message: 'server error'}));
        }
    }
}