const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler');

app.use(morgan('dev'));
app.use(bodyParser.json());

const search = require('./routes/search');
// const status = require('./routes/status');

app.use('/search', search);
// app.use('/status', status);

app.use(errorHandler());

module.exports = app;