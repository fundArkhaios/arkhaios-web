const request = require('supertest');
const express = require('express');
const RESPONSE_TYPE = require('../response_type.js');
const { route } = require('../../server.js');
require('dotenv').config();

jest.mock('../external/alpaca/api'); // Mock the Alpaca API calls

const alpaca = require('../external/alpaca/api');

describe("GET /api/account/get-transfers", () => {
    const server = express();

    server.use(express.json());
    route(server);

    beforeEach(() => {
        // Reset mocks before each test
        alpaca.get_transfers.mockReset();
    });

    it("successful transfer retrieval", async () => {
        // Mock data returned from Alpaca API
        const mockTransferData = [
            // Add mock transfer data here
        ];

        alpaca.get_transfers.mockResolvedValue({ response: mockTransferData, status: 200 });

        // Assuming a valid brokerageID is needed for successful retrieval
        const brokerageID = 'valid_brokerageID';

        const result = await request(server)
            .get("/api/account/get-transfers")
            .set('brokerageID', brokerageID)
            .set('Accept', 'application/json');

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(RESPONSE_TYPE.SUCCESS);
        expect(result.body.data).toEqual(mockTransferData);
    });

    it("failure due to external API error", async () => {
        const brokerageID = 'valid_brokerageID';

        // Mock failure response from Alpaca API
        alpaca.get_transfers.mockResolvedValue({ status: 500 });

        const result = await request(server)
            .get("/api/account/get-transfers")
            .set('brokerageID', brokerageID)
            .set('Accept', 'application/json');

        expect(result.status).toBe(500);
        // Check for server error response
    });

    // Add more tests as necessary to cover other scenarios
});
