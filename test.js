const request = require('supertest');
require('dotenv').config();

const app = require('./server');

describe('HTTP Server Tests', () => {
    let server;

    beforeAll(done => {
        process.env.MESSAGE = "test message";
        server = app.createServer();
        server.listen(done);
    });

    afterAll(done => {
        server.close(done);
    });

    describe('CORS Headers', () => {
        it('should set correct CORS headers', async () => {
            const response = await request(server).get('/');

            expect(response.headers['access-control-allow-origin']).toBe('*');
            expect(response.headers['access-control-allow-methods'])
                .toBe('GET, POST, OPTIONS, PUT, PATCH, DELETE');
            expect(response.headers['access-control-allow-headers'])
                .toBe('X-Requested-With,content-type');
            expect(response.headers['access-control-allow-credentials'])
                .toBe('true');
        });

        it('should handle OPTIONS request correctly', async () => {
            const response = await request(server).options('/');
            expect(response.status).toBe(200);
        });
    });

    describe('GET Requests', () => {
        it('should return 200 and correct JSON response for GET request', async () => {
            // Fai la richiesta
            const response = await request(server).get('/');

            // Verifica lo status code e il content type
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toMatch(/application\/json/);

            // Verifica la struttura e il contenuto del body
            const body = response.body;

            // Verifica che il body abbia tutte le proprietà attese
            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('timestamp');
            expect(body).toHaveProperty('version');

            // Verifica i valori specifici
            expect(body.message).toBe(process.env.MESSAGE);
            expect(body.version).toBe('1.0.0');

            // Verifica che timestamp sia una data valida
            expect(new Date(body.timestamp)).toBeInstanceOf(Date);
        });
    });

    describe('Other HTTP Methods', () => {
        it('should return 405 for POST requests', async () => {
            const response = await request(server).post('/');

            expect(response.status).toBe(405);
            expect(response.body).toEqual({ error: 'Method Not Allowed' });
        });

        it('should return 405 for PUT requests', async () => {
            const response = await request(server).put('/');

            expect(response.status).toBe(405);
            expect(response.body).toEqual({ error: 'Method Not Allowed' });
        });

        it('should return 405 for DELETE requests', async () => {
            const response = await request(server).delete('/');

            expect(response.status).toBe(405);
            expect(response.body).toEqual({ error: 'Method Not Allowed' });
        });
    });
});