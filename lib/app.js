const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler');
const ensureAuth = require('./auth/ensure-auth')();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('./public'));

const auth = require('./routes/auth');
const search = require('./routes/search');
const me = require('./routes/me');
const matches = require('./routes/matches');

app.use('/auth', auth);
app.use('/search', search);
app.use('/me', ensureAuth, me);
app.use('/matches', matches);

app.use(errorHandler());

module.exports = app;