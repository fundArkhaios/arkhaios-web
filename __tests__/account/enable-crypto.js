const request = require('supertest');
const express = require('express');
const RESPONSE_TYPE = require('../response_type.js');
const { route } = require('../../server.js');
require('dotenv').config();

jest.mock('../external/alpaca/api'); // Mock the Alpaca API calls

const alpaca = require('../external/alpaca/api');

describe("POST /api/account/enable-crypto", () => {
    const server = express();

    server.use(express.json());
    route(server);

    beforeEach(() => {
        // Reset mocks before each test
        alpaca.enable_crypto.mockReset();
    });

    it("successful crypto access request", async () => {
        const brokerageID = 'valid_brokerageID';
        const mockIP = '192.168.1.1';

        // Mock successful response from Alpaca API
        alpaca.enable_crypto.mockResolvedValue({ response: { /* Mock response data here */ }, status: 200 });

        const result = await request(server)
            .post("/api/account/enable-crypto")
            .set('brokerageID', brokerageID)
            .set('Accept', 'application/json')
            .send({ ip: mockIP });

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(RESPONSE_TYPE.SUCCESS);
        expect(result.body.message).toBe('crypto access requested');
        // You can add more checks for the 'data' field if necessary
    });

    it("failure due to external API error", async () => {
        const brokerageID = 'valid_brokerageID';
        const mockIP = '192.168.1.1';

        // Mock failure response from Alpaca API
        alpaca.enable_crypto.mockResolvedValue({ status: 500 });

        const result = await request(server)
            .post("/api/account/enable-crypto")
            .set('brokerageID', brokerageID)
            .set('Accept', 'application/json')
            .send({ ip: mockIP });

        expect(result.status).toBe(500);
        // Check for server error response
    });

    // Add more tests as necessary to cover other scenarios
});
