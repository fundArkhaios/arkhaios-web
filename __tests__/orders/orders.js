const alpaca = require('../external/alpaca/api');
const { get } = require('./path-to-orders-module'); // Adjust this path

jest.mock('../external/alpaca/api', () => ({
    get_orders: jest.fn()
}));

describe("orders API", () => {
    beforeEach(() => {
        alpaca.get_orders.mockClear();
    });

    it("successfully retrieves orders", async () => {
        const mockBrokerageID = "brokerage123";
        const mockResponseData = [ /* mock orders data */ ];

        alpaca.get_orders.mockResolvedValue({ response: mockResponseData, status: 200 });

        const res = await get({
            user: { brokerageID: mockBrokerageID },
            body: { status: "all" }
        });

        expect(alpaca.get_orders).toHaveBeenCalledWith(mockBrokerageID, "all");
        expect(res.status).toBe(200);
        expect(res.body.status).toBe(RESPONSE_TYPE.SUCCESS);
        expect(res.body.data).toEqual(mockResponseData);
    });

    // Additional tests for handling different order statuses and error responses from Alpaca API
});
