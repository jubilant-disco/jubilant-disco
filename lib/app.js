const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler');
const ensureAuth = require('./auth/ensure-auth')();
const mongoSanitize = require('express-mongo-sanitize');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('./public'));
app.use(mongoSanitize());

const auth = require('./routes/auth');
const search = require('./routes/search');
const me = require('./routes/me');
const users = require('./routes/users');

app.use('/auth', auth);
app.use('/search', search);
app.use('/me', ensureAuth, me);
app.use('/users', users);

app.use(errorHandler());

module.exports = app;