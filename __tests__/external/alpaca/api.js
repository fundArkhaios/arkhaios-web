// Import necessary modules and functions
const api = require('./api'); // Adjust the path based on your file structure
global.fetch = require('jest-fetch-mock'); // Mock fetch globally

describe("Alpaca API module tests", () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it("tests get_accounts function", async () => {
        fetch.mockResponseOnce(JSON.stringify({ accounts: [] }));

        const response = await api.get_accounts();

        expect(fetch).toHaveBeenCalledWith(
            "https://broker-api.sandbox.alpaca.markets/v1/accounts",
            expect.objectContaining({
                method: "GET",
                headers: expect.any(Object),
            })
        );

        expect(response.response).toEqual({ accounts: [] });
    });

    // Additional tests for create_account, get_assets, etc.

    it("tests create_account function", async () => {
        const mockPayload = { /* payload data */ };
        fetch.mockResponseOnce(JSON.stringify({ status: "success" }));

        const response = await api.create_account(mockPayload);

        expect(fetch).toHaveBeenCalledWith(
            "https://broker-api.sandbox.alpaca.markets/v1/accounts",
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify(mockPayload),
                headers: expect.any(Object),
            })
        );

        expect(response.response).toEqual({ status: "success" });
    });

    // Continue with tests for other methods in a similar fashion
});
