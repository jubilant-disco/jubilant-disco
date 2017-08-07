/* eslint no-console: "off" */
const app = require('./lib/app');
const http = require('http');
require('dotenv').config()
const dbUri = process.env.MONGO_URI;
const connect = require('./lib/connect');

connect(dbUri);
const server = http.createServer(app);

server.listen(3001, () => {
    console.log('server running on', server.address());
});