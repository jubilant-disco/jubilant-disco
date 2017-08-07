const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler');

app.use(morgan('dev'));
app.use(bodyParser.json());

const users = require('./routes/user-routes');
const search = require('./routes/search');

app.use('/search', search);
app.use('/users', users);
// matches routes, search routes?
app.use(errorHandler());

module.exports = app;