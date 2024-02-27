const request = require('supertest');
const express = require('express');
const { route } = require('../../server.js');
require('dotenv').config();

jest.mock('../external/alpaca/api'); // Mock the Alpaca API calls

const alpaca = require('../external/alpaca/api');

describe("GET /api/account/document", () => {
    const server = express();

    server.use(express.json());
    route(server);

    beforeEach(() => {
        // Reset mocks before each test
        alpaca.get_document.mockReset();
    });

    it("successful document retrieval", async () => {
        const brokerageID = 'valid_brokerageID';
        const documentId = 'valid_documentId';

        // Mock binary data for the PDF document
        const mockDocumentData = Buffer.from('mock_pdf_data');

        alpaca.get_document.mockResolvedValue({ response: mockDocumentData, status: 200 });

        const result = await request(server)
            .get("/api/account/document")
            .query({ id: documentId })
            .set('brokerageID', brokerageID)
            .set('Accept', 'application/pdf');

        expect(result.status).toBe(200);
        expect(result.headers['content-type']).toBe('application/pdf');
        // Validate the response data if necessary
    });

    it("failure due to external API error", async () => {
        const brokerageID = 'valid_brokerageID';
        const documentId = 'valid_documentId';

        // Mock failure response from Alpaca API
        alpaca.get_document.mockResolvedValue({ status: 500 });

        const result = await request(server)
            .get("/api/account/document")
            .query({ id: documentId })
            .set('brokerageID', brokerageID)
            .set('Accept', 'application/pdf');

        expect(result.status).toBe(500);
        // Check for server error response
    });

    // Add more tests as necessary to cover other scenarios
});
