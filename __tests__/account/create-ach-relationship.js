const request = require('supertest');
const express = require('express');
const RESPONSE_TYPE = require('../response_type.js');
const { route } = require('../../server.js');
require('dotenv').config();

jest.mock('../external/alpaca/api'); // Mock the Alpaca API calls

const alpaca = require('../external/alpaca/api');

describe("POST /api/account/create-ach-relationship", () => {
    const server = express();

    server.use(express.json());
    route(server);

    beforeEach(() => {
        // Reset mocks before each test
        alpaca.create_ach_relationship.mockReset();
    });

    it("successful ACH relationship creation", async () => {
        const brokerageID = 'valid_brokerageID';
        const processorToken = 'valid_processor_token';

        // Mock successful response from Alpaca API
        alpaca.create_ach_relationship.mockResolvedValue({
            response: { /* Mock response data here */ },
            status: 200
        });

        const result = await request(server)
            .post("/api/account/create-ach-relationship")
            .send({ processor_token: processorToken })
            .set('brokerageID', brokerageID)
            .set('Accept', 'application/json');

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(RESPONSE_TYPE.SUCCESS);
        // You can add more checks for the 'data' field if necessary
    });

    it("failure due to external API error", async () => {
        const brokerageID = 'valid_brokerageID';
        const processorToken = 'valid_processor_token';

        // Mock failure response from Alpaca API
        alpaca.create_ach_relationship.mockResolvedValue({ status: 500 });

        const result = await request(server)
            .post("/api/account/create-ach-relationship")
            .send({ processor_token: processorToken })
            .set('brokerageID', brokerageID)
            .set('Accept', 'application/json');

        expect(result.status).toBe(500);
        // Check for server error response
    });

    // Add more tests as necessary to cover other scenarios
});
