const app = require('./server');

const port = process.env.PORT || 3000;
const server = app.createServer();

server.listen(port, () => {
    console.log(`The app is listening on port ${port}`);
});