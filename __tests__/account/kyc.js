const request = require('supertest');
const express = require('express');
const RESPONSE_TYPE = require('../../api/response_type.js');
const { route } = require('../../server.js');
require('dotenv').config();

jest.mock('../external/alpaca/api'); // Mock the Alpaca API calls

const alpaca = require('../external/alpaca/api');

describe("POST /api/account/kyc", () => {
    const server = express();

    server.use(express.json());
    route(server);

    beforeEach(() => {
        // Reset mocks before each test
        alpaca.create_account.mockReset();
    });

    it("successful KYC submission", async () => {
        const validKYCData = {
            phone: "1234567890",
            address: "123 Main St",
            city: "Anytown",
            state: "CA",
            postal_code: "12345",
            country: "USA",
            first_name: "John",
            last_name: "Doe",
            dob_year: "1990",
            dob_month: "01",
            dob_day: "01",
            ssn: "123-45-6789",
            funding_source: "employment_income",
            is_affiliated: false,
            is_control_person: false,
            is_pep: false,
            family_exposed: false
        };

        // Mock successful Alpaca API response
        alpaca.create_account.mockResolvedValue({ response: { id: 'some_id' }, status: 200 });

        const result = await request(server)
            .post("/api/account/kyc")
            .send(validKYCData)
            .set('Accept', 'application/json');

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(RESPONSE_TYPE.SUCCESS);
        expect(result.body.message).toBe("kyc submitted successfully");
    });

    it("failure due to missing fields", async () => {
        const invalidKYCData = {
            country: "USA",
            first_name: "John",
            last_name: "Doe",
            funding_source: "employment_income"
        };

        const result = await request(server)
            .post("/api/account/kyc")
            .send(invalidKYCData)
            .set('Accept', 'application/json');

        expect(result.status).toBe(422);
        // Example: expect(result.body.error).toBe("Phone number is required.");
    });

    it("failure due to external API error", async () => {
        const validKYCData = {
            // Same data as in the successful test
            phone: "1234567890",
            address: "123 Main St",
            city: "Anytown",
            state: "CA",
            postal_code: "12345",
            country: "USA",
            first_name: "John",
            last_name: "Doe",
            dob_year: "1990",
            dob_month: "01",
            dob_day: "01",
            ssn: "123-45-6789",
            funding_source: "employment_income",
            is_affiliated: false,
            is_control_person: false,
            is_pep: false,
            family_exposed: false
        };

        // Mock failure Alpaca API response
        alpaca.create_account.mockResolvedValue({ status: 500 });

        const result = await request(server)
            .post("/api/account/kyc")
            .send(validKYCData)
            .set('Accept', 'application/json');

        expect(result.status).toBe(500);
        // Exa: expect(result.body.status).toBe(RESPONSE_TYPE.ERROR);
    });

});
