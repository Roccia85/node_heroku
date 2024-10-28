const http = require('http');
require('dotenv').config();

const requestHandler = (req, res) => {
    // Aggiungi headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Gestisci le richieste OPTIONS per i preflight CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Gestisci la richiesta normale
    if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            message: process.env.MESSAGE,
            timestamp: new Date(),
            version: '1.0.0'
        }));
    } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    }
};

const server = http.createServer(requestHandler);
module.exports = requestHandler;


// const server = http.createServer((req, res) => 

const port = process.env.PORT || 3000;
server.listen(port);

console.log(`The app is listening on port ${port}`);

