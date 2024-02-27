const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const { RESPONSE_TYPE } = require('../../api/response_type.js');
const { route } = require('../../server.js')
require('dotenv').config()

describe("POST /api/account/login", () => {
    // Kind of always need this
    const server = express();

    server.use(cookieParser());
    server.use(express.json());

    route(server);
    

    it("login without mfa fail", async function() {
        let agent = request.agent(server);

        let result = await agent.post("/api/account/login")
            .send({"email": "a@a.com", "password": "wrong_password"})
            .set('Accept', 'application/json')

        let json = JSON.parse(result.text)
        expect(json.status).toBe(RESPONSE_TYPE.FAILED)
    })



    it("login without mfa success", async function() {
        let agent = request.agent(server);

        let result = await agent.post("/api/account/login")
            .send({"email": "a@a.com", "password": "password"})
            .set('Accept', 'application/json')

        let json = JSON.parse(result.text)
        expect(json.status).toBe(RESPONSE_TYPE.SUCCESS)
    })

    it("mfa verified check", async function() {
        let agent = request.agent(server);

        let result = await agent.post("/api/account/login")
            .send({"email": "email@email.com", "password": "password"})
            .set('Accept', 'application/json')

        let json = JSON.parse(result.text)

        // failed response due to login without mfa code
        expect(json.status).toBe(RESPONSE_TYPE.FAILED)

        // mfa should still return true
        expect(json.data.mfa).toBe(true)
    })

    it("mfa unverified check", async function() {
        let agent = request.agent(server);

        let result = await agent.post("/api/account/login")
            .send({"email": "mfa@arkhaios.io", "password": "password", "mfa": "0"})
            .set('Accept', 'application/json')

        let json = JSON.parse(result.text)

        // failed response due to login without mfa code
        expect(json.status).toBe(RESPONSE_TYPE.FAILED)

        // mfa should still return true
        expect(json.message).toBe('invalid credentials')
    })

})