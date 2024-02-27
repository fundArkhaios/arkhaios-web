const sendgrid = require('@sendgrid/mail');
const db = require('../../../util/db');
const { randomInt } = require('node:crypto');
const { sendCode } = require('./path-to-your-module'); // Adjust this path

jest.mock('@sendgrid/mail', () => ({
    send: jest.fn()
}));

jest.mock('../../../util/db', () => ({
    updateUser: jest.fn()
}));

jest.mock('node:crypto', () => ({
    randomInt: jest.fn()
}));

describe('sendCode function', () => {
    beforeEach(() => {
        sendgrid.send.mockClear();
        db.updateUser.mockClear();
        randomInt.mockClear();
    });

    it('successfully sends a verification code', async () => {
        const mockEmail = 'test@example.com';
        const mockSubject = 'Test Subject';
        const mockText = '{} is your code';
        const mockKey = '123456';

        // Mocking the behavior of randomInt and db.updateUser
        randomInt.mockReturnValueOnce(1) // Repeat this for each digit in mockKey
                   .mockReturnValueOnce(2)
                   .mockReturnValueOnce(3)
                   .mockReturnValueOnce(4)
                   .mockReturnValueOnce(5)
                   .mockReturnValueOnce(6);
        db.updateUser.mockResolvedValue(true);

        await sendCode(mockEmail, mockSubject, mockText);

        expect(db.updateUser).toHaveBeenCalled();
        expect(sendgrid.send).toHaveBeenCalledWith({
            to: mockEmail,
            from: expect.any(String), // or your specific email
            subject: mockSubject,
            text: '123456 is your code'
        });
    });

    // Additional tests can be written to handle cases where db.updateUser fails, etc.
});
