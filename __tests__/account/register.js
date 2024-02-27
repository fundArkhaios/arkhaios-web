const request = require('supertest');
const express = require('express');
const RESPONSE_TYPE = require('../response_type');
const { route } = require('../../server.js');
require('dotenv').config();

jest.mock('../../util/db'); // Mock the database calls
jest.mock('../external/sendgrid/api'); // Mock SendGrid API

const db = require('../../util/db');
const sendgrid = require('../external/sendgrid/api');

describe("POST /api/account/register", () => {
    const server = express();

    server.use(express.json());
    route(server);

    beforeEach(() => {
        // Reset mocks before each test
        db.connect.mockReset();
        sendgrid.sendCode.mockReset();
    });

    it("successful account registration", async () => {
        const registrationData = {
            firstName: "John",
            lastName: "Doe",
            email: "johndoe@example.com",
            password: "password123"
        };

        db.connect.mockImplementationOnce(cb => cb({
            collection: () => ({
                findOne: () => Promise.resolve(null),
                insertOne: () => Promise.resolve({ acknowledged: true })
            })
        }));

        const result = await request(server)
            .post("/api/account/register")
            .send(registrationData)
            .set('Accept', 'application/json');

        expect(result.status).toBe(201);
        expect(result.body.status).toBe(RESPONSE_TYPE.SUCCESS);
        expect(result.body.message).toBe('account created');
        // You can add more checks for the 'data' field if necessary
    });

    it("failure due to email already in use", async () => {
        const registrationData = {
            firstName: "John",
            lastName: "Doe",
            email: "existing@example.com",
            password: "password123"
        };

        // Mock database response for an existing email
        db.connect.mockImplementationOnce(cb => cb({
            collection: () => ({
                findOne: () => Promise.resolve({ email: registrationData.email })
            })
        }));

        const result = await request(server)
            .post("/api/account/register")
            .send(registrationData)
            .set('Accept', 'application/json');

        expect(result.status).toBe(401);
        expect(result.body.status).toBe(RESPONSE_TYPE.ERROR);
        expect(result.body.message).toBe('email is already in use');
    });

    // Add more tests as necessary to cover other scenarios like server errors, duplicate usernames, etc.
});
