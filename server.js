/* eslint no-console: "off" */
require('dotenv').config();
const http = require('http');
const app = require('./lib/app');
require('./lib/connect');

const server = http.createServer(app);

server.listen((3001 || process.env.port), () => {
    console.log('server running on', server.address());
});