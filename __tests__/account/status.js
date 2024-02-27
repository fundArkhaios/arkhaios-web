const request = require('supertest');
const express = require('express');
const RESPONSE_TYPE = require('../response_type.js');
const { route } = require('../../server.js');
require('dotenv').config();

jest.mock('../external/alpaca/api'); // Mock the Alpaca API calls

const alpaca = require('../external/alpaca/api');

describe("GET /api/account/status", () => {
    const server = express();

    server.use(express.json());
    route(server);

    beforeEach(() => {
        // Reset mocks before each test
        alpaca.account_status.mockReset();
    });

    it("successful account status retrieval", async () => {
        const brokerageID = 'valid_brokerageID';

        // Mock successful response from Alpaca API
        alpaca.account_status.mockResolvedValue({
            response: { /* Mock response data here */ },
            status: 200
        });

        const result = await request(server)
            .get("/api/account/status")
            .set('brokerageID', brokerageID)
            .set('Accept', 'application/json');

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(RESPONSE_TYPE.SUCCESS);
        // You can add more checks for the 'data' field if necessary
    });

    it("failure due to external API error", async () => {
        const brokerageID = 'valid_brokerageID';

        // Mock failure response from Alpaca API
        alpaca.account_status.mockResolvedValue({ status: 500 });

        const result = await request(server)
            .get("/api/account/status")
            .set('brokerageID', brokerageID)
            .set('Accept', 'application/json');

        expect(result.status).toBe(500);
        // Check for server error response
    });

    // Add more tests as necessary to cover other scenarios
});
