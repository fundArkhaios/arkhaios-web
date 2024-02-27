const request = require('supertest');
const express = require('express');
const RESPONSE_TYPE = require('../response_type');
const { route } = require('../../server.js');
require('dotenv').config();

jest.mock('../external/alpaca/api'); // Mock the Alpaca API calls

const alpaca = require('../external/alpaca/api');

describe("GET /api/account/equity", () => {
    const server = express();

    server.use(express.json());
    route(server);

    beforeEach(() => {
        // Reset mocks before each test
        alpaca.get_portfolio.mockReset();
    });

    it("successful equity retrieval", async () => {
        const brokerageID = 'valid_brokerageID';

        // Mock successful response from Alpaca API
        const mockEquityData = {
            equity: [/* Mock equity data here, e.g., 100, 200, 300 */]
        };
        alpaca.get_portfolio.mockResolvedValue({
            response: mockEquityData,
            status: 200
        });

        const result = await request(server)
            .get("/api/account/equity")
            .set('brokerageID', brokerageID)
            .set('Accept', 'application/json');

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(RESPONSE_TYPE.SUCCESS);
        expect(result.body.data).toEqual({ equity: mockEquityData.equity[mockEquityData.equity.length - 1] });
    });

    it("failure due to external API error", async () => {
        const brokerageID = 'valid_brokerageID';

        // Mock failure response from Alpaca API
        alpaca.get_portfolio.mockResolvedValue({ status: 500 });

        const result = await request(server)
            .get("/api/account/equity")
            .set('brokerageID', brokerageID)
            .set('Accept', 'application/json');

        expect(result.status).toBe(500);
        // Check for server error response
    });

    // Add more tests as necessary to cover other scenarios
});
