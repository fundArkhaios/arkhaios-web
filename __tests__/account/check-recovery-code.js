const request = require('supertest');
const express = require('express');
const { route } = require('../../server.js');
require('dotenv').config();

jest.mock('../../util/db'); // Mock the database calls

const db = require('../../util/db');

describe("POST /api/account/check-recovery-code", () => {
    const server = express();

    server.use(express.json());
    route(server);

    beforeEach(() => {
        // Reset mocks before each test
        db.connect.mockReset();
    });

    it("successful recovery code validation", async () => {
        const email = 'test@example.com';
        const recoveryCode = 'valid_recovery_code';

        // Mock database response for successful validation
        db.connect.mockImplementationOnce(cb => cb({
            collection: () => ({
                findOne: () => Promise.resolve({ email, verificationCode: recoveryCode })
            })
        }));

        const result = await request(server)
            .post("/api/account/check-recovery-code")
            .send({ email, recoveryCode })
            .set('Accept', 'application/json');

        expect(result.status).toBe(200);
        expect(result.body.error).toBe("");
    });

    it("failure due to no match", async () => {
        const email = 'test@example.com';
        const recoveryCode = 'invalid_recovery_code';

        // Mock database response for no match
        db.connect.mockImplementationOnce(cb => cb({
            collection: () => ({
                findOne: () => Promise.resolve(null)
            })
        }));

        const result = await request(server)
            .post("/api/account/check-recovery-code")
            .send({ email, recoveryCode })
            .set('Accept', 'application/json');

        expect(result.status).toBe(401);
        expect(result.body.error).toBe("No match");
    });

    // Add more tests as necessary to cover other scenarios like database errors
});
