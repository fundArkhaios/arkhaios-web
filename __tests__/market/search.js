const db = require('../../util/db');
const { get } = require('./path-to-search-module'); // Adjust this path

jest.mock('../../util/db', () => ({
    connect: jest.fn()
}));

describe("search API", () => {
    beforeEach(() => {
        db.connect.mockReset();
    });

    it("successfully searches and returns results", async () => {
        const mockQuery = "AAPL";
        const mockResponseData = [
            { symbol: "AAPL", name: "Apple Inc." },
            // ... other mock assets
        ];

        db.connect.mockImplementationOnce(cb => cb({
            collection: () => ({
                find: () => ({
                    limit: () => ({
                        toArray: () => Promise.resolve(mockResponseData)
                    })
                })
            })
        }));

        const res = await get({ 
            query: { query: mockQuery }
        });

        expect(db.connect).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual(mockResponseData);
    });

    it("handles no results found", async () => {
        const mockQuery = "Unknown";
        db.connect.mockImplementationOnce(cb => cb({
            collection: () => ({
                find: () => ({
                    limit: () => ({
                        toArray: () => Promise.resolve([])
                    })
                })
            })
        }));

        const res = await get({ 
            query: { query: mockQuery }
        });

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual([]);
    });

    // Additional tests for error handling scenarios
});
