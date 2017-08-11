/* eslint no-console: "off" */
require('dotenv').config({path: 'seeding.env'})
const http = require('http');
const app = require('./lib/app');
require('./lib/connect');
const PORT = process.env.PORT || 3001;


const server = http.createServer(app);

server.listen(PORT, () => {
    console.log('server running on', server.address());
});