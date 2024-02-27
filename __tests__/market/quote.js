global.fetch = require('jest-fetch-mock'); // Mock fetch globally
const alpaca = require('../external/alpaca/api'); // Adjust the path
const { get } = require('./path-to-quote-module'); // Adjust this path

jest.mock('../external/alpaca/api', () => ({
    get_assets: jest.fn(),
    get_asset: jest.fn()
}));

describe("quote API", () => {
    beforeEach(() => {
        fetch.resetMocks();
        alpaca.get_assets.mockClear();
        alpaca.get_asset.mockClear();
    });

    it("successfully fetches and returns quote data from Yahoo Finance", async () => {
        const mockSymbol = "AAPL";
        const mockResponseData = {
            chart: {
                result: [
                    {
                        meta: {
                            regularMarketPrice: 150
                        }
                    }
                ]
            }
        };

        fetch.mockResponseOnce(JSON.stringify(mockResponseData));

        const res = await get({ 
            query: { id: mockSymbol }
        });

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("https://query1.finance.yahoo.com/v8/finance/chart/AAPL"),
            expect.objectContaining({
                method: "GET",
            })
        );

        expect(res.status).toBe(200);
        expect(res.body.data.price).toEqual(150);
    });

    it("falls back to Alpaca when Yahoo Finance fails", async () => {
        const mockSymbol = "AAPL";
        fetch.mockRejectOnce(new Error("Yahoo Finance API error"));

        alpaca.get_assets.mockResolvedValue([
            { symbol: mockSymbol, lastPrice: 150, id: "someId" }
        ]);

        const res = await get({ 
            query: { id: mockSymbol }
        });

        expect(alpaca.get_assets).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.data.price).toEqual(150);
    });

    // Additional tests for non-existent symbols and other error scenarios
});
