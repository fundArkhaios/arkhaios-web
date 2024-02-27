const request = require('supertest');
const express = require('express');
const { route } = require('../../server.js');
require('dotenv').config();

jest.mock('../../util/db'); // Mock the database calls
jest.mock('../external/sendgrid/api'); // Mock SendGrid API

const db = require('../../util/db');
const sendgrid = require('../external/sendgrid/api');

describe("POST /api/account/send-recovery-code", () => {
    const server = express();

    server.use(express.json());
    route(server);

    beforeEach(() => {
        // Reset mocks before each test
        db.connect.mockReset();
        sendgrid.sendCode.mockReset();
    });

    it("successful sending of recovery code", async () => {
        const requestData = { email: "existing@example.com" };

        // Mock database response for existing email
        db.connect.mockImplementationOnce(cb => cb({
            collection: () => ({
                findOne: () => Promise.resolve({ email: requestData.email })
            })
        }));

        const result = await request(server)
            .post("/api/account/send-recovery-code")
            .send(requestData)
            .set('Accept', 'application/json');

        expect(result.status).toBe(200);
        expect(result.body.error).toBe("");
    });

    it("failure due to account not existing", async () => {
        const requestData = { email: "nonexistent@example.com" };

        // Mock database response for non-existent email
        db.connect.mockImplementationOnce(cb => cb({
            collection: () => ({
                findOne: () => Promise.resolve(null)
            })
        }));

        const result = await request(server)
            .post("/api/account/send-recovery-code")
            .send(requestData)
            .set('Accept', 'application/json');

        expect(result.status).toBe(503);
        expect(result.body.error).toBe("Account does not exist.");
    });

    // Add more tests as necessary to cover other scenarios like database errors, SendGrid errors, etc.
});
