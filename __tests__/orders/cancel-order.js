const alpaca = require('../external/alpaca/api');
const { post } = require('./path-to-cancel-order-module'); // Adjust this path

jest.mock('../external/alpaca/api', () => ({
    cancel_order: jest.fn()
}));

describe("cancel-order API", () => {
    beforeEach(() => {
        alpaca.cancel_order.mockClear();
    });

    it("successfully cancels an order", async () => {
        const mockOrderID = "order123";
        const mockBrokerageID = "brokerage123";
        const mockResponseData = { /* mock response data from Alpaca */ };

        alpaca.cancel_order.mockResolvedValue({ response: mockResponseData, status: 200 });

        const res = await post({
            body: { order: mockOrderID },
            user: { brokerageID: mockBrokerageID }
        });

        expect(alpaca.cancel_order).toHaveBeenCalledWith(mockBrokerageID, mockOrderID);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe(RESPONSE_TYPE.SUCCESS);
    });

    it("returns an error if order id is not provided", async () => {
        const res = await post({
            body: {},
            user: { brokerageID: "brokerage123" }
        });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe(RESPONSE_TYPE.FAILED);
        expect(res.body.message).toBe("order id required");
    });

    // Additional tests for handling Alpaca API errors
});
