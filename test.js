const request = require('supertest');
const app = require('./server');

describe('Express Server Tests', () => {
    const TEST_MESSAGE = 'Test message';

    beforeAll(() => {
        process.env.MESSAGE = TEST_MESSAGE;
    });

    afterAll(() => {
        delete process.env.MESSAGE;
    });

    describe('CORS and Headers', () => {
        it('should enable CORS', async () => {
            const response = await request(app).get('/');

            expect(response.headers['access-control-allow-origin']).toBe('*');
        });

        it('should handle OPTIONS request correctly', async () => {
            const response = await request(app).options('/');
            expect(response.status).toBe(204); // Express CORS default response
        });
    });

    describe('GET Requests', () => {
        it('should return 200 and correct JSON response for GET request', async () => {
            const response = await request(app).get('/');

            // Log per debug
            console.log('Response body:', response.body);
            console.log('Environment MESSAGE:', process.env.MESSAGE);

            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/application\/json/);

            expect(response.body).toEqual({
                message: TEST_MESSAGE,
                timestamp: expect.any(String),
                version: '1.0.0'
            });

            expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
        });

        it('should use default message when MESSAGE env is not set', async () => {
            const originalMessage = process.env.MESSAGE;
            delete process.env.MESSAGE;

            const response = await request(app).get('/');
            expect(response.body.message).toBe('Default message');

            process.env.MESSAGE = originalMessage;
        });
    });

    describe('Other HTTP Methods', () => {
        it('should return 405 for POST requests', async () => {
            const response = await request(app).post('/');

            expect(response.status).toBe(405);
            expect(response.body).toEqual({ error: 'Method Not Allowed' });
        });

        it('should return 405 for PUT requests', async () => {
            const response = await request(app).put('/');

            expect(response.status).toBe(405);
            expect(response.body).toEqual({ error: 'Method Not Allowed' });
        });

        it('should return 405 for DELETE requests', async () => {
            const response = await request(app).delete('/');

            expect(response.status).toBe(405);
            expect(response.body).toEqual({ error: 'Method Not Allowed' });
        });
    });

});