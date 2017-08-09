const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler');
// const ensureAuth = require('./auth/ensure-auth')

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('./public'));

const auth = require('./routes/auth');
const search = require('./routes/search');
const users = require('./routes/users');
const seeds = require('./routes/seeds');

app.use('/auth', auth);
app.use('/search', search);
app.use('/users', users);
app.use('/seeds', seeds);

app.use(errorHandler());

module.exports = app;