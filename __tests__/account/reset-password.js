const request = require('supertest');
const express = require('express');
const { route } = require('../../server.js');
require('dotenv').config();

jest.mock('../../util/db'); // Mock the database calls

const db = require('../../util/db');

describe("POST /api/account/reset-password", () => {
    const server = express();

    server.use(express.json());
    route(server);

    beforeEach(() => {
        // Reset mocks before each test
        db.updateUser.mockReset();
    });

    it("successful password reset", async () => {
        const resetData = {
            email: "user@example.com",
            password: "newPassword123"
        };

        // Mock successful database update
        db.updateUser.mockResolvedValue(true);

        const result = await request(server)
            .post("/api/account/reset-password")
            .send(resetData)
            .set('Accept', 'application/json');

        expect(result.status).toBe(200);
        expect(result.body.status).toBe("success");
    });

    it("failure due to database update issue", async () => {
        const resetData = {
            email: "user@example.com",
            password: "newPassword123"
        };

        // Mock failure in database update
        db.updateUser.mockResolvedValue(false);

        const result = await request(server)
            .post("/api/account/reset-password")
            .send(resetData)
            .set('Accept', 'application/json');

        expect(result.status).toBe(500);
        expect(result.body.status).toBe("failed");
    });

    // Add more tests as necessary to cover other scenarios, including error handling
});
