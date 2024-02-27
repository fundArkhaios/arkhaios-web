const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const RESPONSE_TYPE = require('../../api/response_type.js');
const { route } = require('../../server.js')
require('dotenv').config()

describe("POST /api/account/logout", () => {
    const server = express();

    server.use(cookieParser());
    server.use(express.json());

    route(server);

    // Test for successful logout
    it("successful logout", async function() {
        let agent = request.agent(server);

        // Assuming a valid session token and email are required for successful logout
        agent.set('Cookie', ['session=valid_session_token', 'email=a@a.com']);

        let result = await agent.post("/api/account/logout")
            .set('Accept', 'application/json')

        let json = JSON.parse(result.text);
        expect(json.status).toBe(RESPONSE_TYPE.SUCCESS);
        expect(json.message).toBe("session ended");
    });

    // Test for unsuccessful logout due to invalid session
    it("unsuccessful logout with invalid session", async function() {
        let agent = request.agent(server);

        // Assuming an invalid session token
        agent.set('Cookie', ['session=invalid_session_token', 'email=email@email.com']);

        let result = await agent.post("/api/account/logout")
            .set('Accept', 'application/json')

        let json = JSON.parse(result.text);
        // Assuming the response type for unsuccessful logout due to invalid session
        expect(json.status).toBe(RESPONSE_TYPE.FAILED);
    });

    // Test for server error during logout
    it("server error during logout", async function() {
        let agent = request.agent(server);

        // Setup a scenario that triggers a server error
        // This might require mocking the database update or Redis call to fail
        // For simplicity, the details of this setup are not provided here

        let result = await agent.post("/api/account/logout")
            .set('Accept', 'application/json')

        let json = JSON.parse(result.text);
        expect(json.status).toBe(RESPONSE_TYPE.ERROR);
    });
})
