const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler');

app.use(morgan('dev'));
app.use(bodyParser.json());

const auth = require('./routes/auth');
const users = require('./routes/users');
const search = require('./routes/search');

app.use('/search', search);
app.use('/users', users);
app.use('/auth', auth);
// matches routes, search routes?
app.use(errorHandler());

module.exports = app;