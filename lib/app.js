const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler');

app.use(morgan('dev'));
app.use(bodyParser.json());

const auth = require('./routes/auth');
const search = require('./routes/search');
const users = require('./routes/users');

app.use('/auth', auth);
app.use('/search', search);
app.use('/users', users);

app.use(errorHandler());

module.exports = app;