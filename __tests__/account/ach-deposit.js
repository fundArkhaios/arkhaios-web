const request = require('supertest');
const express = require('express');
const RESPONSE_TYPE = require('../response_type.js');
const { route } = require('../../server.js');
require('dotenv').config();

jest.mock('../external/alpaca/api'); // Mock the Alpaca API calls

const alpaca = require('../external/alpaca/api');

describe("POST /api/account/ach-deposit", () => {
    const server = express();

    server.use(express.json());
    route(server);

    beforeEach(() => {
        // Reset mocks before each test
        alpaca.create_transfer.mockReset();
    });

    it("successful ACH deposit", async () => {
        const brokerageID = 'valid_brokerageID';
        const depositData = {
            relationship_id: 'valid_relationship_id',
            amount: 1000
        };

        // Mock successful response from Alpaca API
        alpaca.create_transfer.mockResolvedValue({
            response: { /* Mock response data here */ },
            status: 200
        });

        const result = await request(server)
            .post("/api/account/ach-deposit")
            .send(depositData)
            .set('brokerageID', brokerageID)
            .set('Accept', 'application/json');

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(RESPONSE_TYPE.SUCCESS);
        // You can add more checks for the 'data' field if necessary
    });

    it("failure due to external API error", async () => {
        const brokerageID = 'valid_brokerageID';
        const depositData = {
            relationship_id: 'valid_relationship_id',
            amount: 1000
        };

        // Mock failure response from Alpaca API
        alpaca.create_transfer.mockResolvedValue({ status: 500 });

        const result = await request(server)
            .post("/api/account/ach-deposit")
            .send(depositData)
            .set('brokerageID', brokerageID)
            .set('Accept', 'application/json');

        expect(result.status).toBe(500);
        // Check for server error response
    });

    // Add more tests as necessary to cover other scenarios
});
