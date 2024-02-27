const request = require('supertest');
const express = require('express');
const RESPONSE_TYPE = require('../response_type');
const { route } = require('../../server.js');
require('dotenv').config();

jest.mock('../../util/db'); // Mock the database calls

const db = require('../../util/db');

describe("/api/account/watchlist", () => {
    const server = express();

    server.use(express.json());
    route(server);

    const user = {
        accountID: 'userAccountID'
    };

    beforeEach(() => {
        // Reset mocks before each test
        db.connect.mockReset();
    });

    // POST Tests
    describe("POST /api/account/watchlist", () => {
        it("successful symbol addition", async () => {
            const watchlistData = { symbol: "AAPL" };

            db.connect.mockImplementationOnce(cb => cb({
                collection: () => ({
                    findOne: () => Promise.resolve({ watchlist: [] }),
                    updateOne: () => Promise.resolve({ acknowledged: true })
                })
            }));

            const result = await request(server)
                .post("/api/account/watchlist")
                .send(watchlistData)
                .set('user', JSON.stringify(user))
                .set('Accept', 'application/json');

            expect(result.status).toBe(200);
            expect(result.body.status).toBe(RESPONSE_TYPE.SUCCESS);
            expect(result.body.message).toBe("symbol added to watchlist");
        });

        // Additional tests for removal, error handling, and invalid input
    });

    // GET Tests
    describe("GET /api/account/watchlist", () => {
        it("retrieve watchlist successfully", async () => {
            db.connect.mockImplementationOnce(cb => cb({
                collection: () => ({
                    findOne: () => Promise.resolve({ watchlist: ["AAPL", "GOOG"] })
                })
            }));

            const result = await request(server)
                .get("/api/account/watchlist")
                .set('user', JSON.stringify(user))
                .set('Accept', 'application/json');

            expect(result.status).toBe(200);
            expect(result.body.status).toBe(RESPONSE_TYPE.SUCCESS);
            expect(result.body.data).toEqual(["AAPL", "GOOG"]);
        });

        // Additional tests for empty watchlist and error handling
    });
});
