global.fetch = require('jest-fetch-mock'); // Mock fetch globally
const { get } = require('./path-to-chart-module'); // Adjust this path

describe("chart API", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it("successfully fetches and returns chart data", async () => {
        const mockSymbol = "AAPL";
        const mockInterval = "1m";
        const mockRange = "1d";
        const mockResponseData = {
            chart: {
                result: [
                    {
                        timestamp: [1609459200, 1609459260], // Sample timestamps
                        indicators: {
                            quote: [{ close: [132.05, 132.1] }] // Sample closing prices
                        }
                    }
                ]
            }
        };

        fetch.mockResponseOnce(JSON.stringify(mockResponseData));

        const res = await get({ 
            query: { symbol: mockSymbol, interval: mockInterval, range: mockRange }
        });

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("https://query1.finance.yahoo.com/v8/finance/chart/AAPL"),
            expect.objectContaining({
                method: "GET",
            })
        );

        expect(res.status).toBe(200);
        expect(res.body.data.timestamps).toEqual(mockResponseData.chart.result[0].timestamp);
        expect(res.body.data.closes).toEqual(mockResponseData.chart.result[0].indicators.quote[0].close);
    });

    // Additional tests for invalid range, interval, and error handling
});
