const request = require('supertest');
const express = require('express');
const { route } = require('../../server.js');
const RESPONSE_TYPE = require('../response_type');
require('dotenv').config();

jest.mock('../../util/db'); // Mock the database calls
jest.mock('../external/sendgrid/api'); // Mock SendGrid API

const db = require('../../util/db');
const sendgrid = require('../external/sendgrid/api');

describe("POST /api/account/verify", () => {
    const server = express();

    server.use(express.json());
    route(server);

    beforeEach(() => {
        // Reset mocks before each test
        db.updateUser.mockReset();
        sendgrid.sendCode.mockReset();
    });

    const user = {
        email: "user@example.com",
        emailVerified: false,
        verificationCode: "123456",
        verificationExpiry: Date.now() + 3600000 // 1 hour in the future
    };

    it("successful email verification", async () => {
        const verifyData = { verificationCode: user.verificationCode };

        db.updateUser.mockResolvedValue(true);

        const result = await request(server)
            .post("/api/account/verify")
            .send(verifyData)
            .set('user', JSON.stringify(user))
            .set('Accept', 'application/json');

        expect(result.status).toBe(200);
        expect(result.body.status).toBe(RESPONSE_TYPE.SUCCESS);
    });

    it("email already verified", async () => {
        const alreadyVerifiedUser = { ...user, emailVerified: true };
        const result = await request(server)
            .post("/api/account/verify")
            .set('user', JSON.stringify(alreadyVerifiedUser))
            .set('Accept', 'application/json');

        expect(result.status).toBe(401);
        expect(result.body.message).toBe("email has already been verified");
    });

    it("verification code has expired", async () => {
        const expiredUser = { ...user, verificationExpiry: Date.now() - 3600000 }; // 1 hour in the past
        const result = await request(server)
            .post("/api/account/verify")
            .set('user', JSON.stringify(expiredUser))
            .set('Accept', 'application/json');

        expect(result.status).toBe(401);
        expect(result.body.message).toBe("verification code has expired");
    });

    it("resend verification code", async () => {
        const resendData = { resend: true };
        const result = await request(server)
            .post("/api/account/verify")
            .send(resendData)
            .set('user', JSON.stringify(user))
            .set('Accept', 'application/json');

        expect(result.status).toBe(401);
        expect(result.body.message).toBe("a new verification code has been sent");
    });

    it("invalid verification code", async () => {
        const invalidVerifyData = { verificationCode: "wrongcode" };
        const result = await request(server)
            .post("/api/account/verify")
            .send(invalidVerifyData)
            .set('user', JSON.stringify(user))
            .set('Accept', 'application/json');

        expect(result.status).toBe(200);
        expect(result.body.message).toBe("invalid verification code");
    });

    // Add more tests as necessary to cover other scenarios
});
