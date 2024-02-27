const db = require('../../util/db');
const alpaca = require('../external/alpaca/api');
const { post } = require('./path-to-history-module'); // Adjust this path

jest.mock('../../util/db', () => ({
    redis: {
        get: jest.fn(),
        setEx: jest.fn()
    }
}));

jest.mock('../external/alpaca/api', () => ({
    get_portfolio: jest.fn()
}));

describe("history API", () => {
    beforeEach(() => {
        db.redis.get.mockClear();
        db.redis.setEx.mockClear();
        alpaca.get_portfolio.mockClear();
    });

    it("successfully retrieves history from cache", async () => {
        const mockData = { /* mock historical data */ };
        db.redis.get.mockResolvedValue(JSON.stringify(mockData));

        const res = await post({
            body: { period: "1D", timeframe: "1Min" },
            user: { brokerageID: "brokerage123" }
        });

        expect(db.redis.get).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.status).toBe(RESPONSE_TYPE.SUCCESS);
        expect(res.body.data.history).toEqual(mockData);
    });

    it("retrieves history from Alpaca when not in cache", async () => {
        db.redis.get.mockResolvedValue(null);

        const mockResponseData = { /* mock response data from Alpaca */ };
        alpaca.get_portfolio.mockResolvedValue({ response: mockResponseData, status: 200 });

        const res = await post({
            body: { period: "1D", timeframe: "1Min" },
            user: { brokerageID: "brokerage123" }
        });

        expect(alpaca.get_portfolio).toHaveBeenCalled();
        expect(db.redis.setEx).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.status).toBe(RESPONSE_TYPE.SUCCESS);
        expect(res.body.data.history).toEqual(mockResponseData);
    });

    // Additional tests for invalid period/timeframe and error handling
});
