const connection = require('mongoose').connection;
const request = require('./request');
require('../../../lib/connect');

module.exports = {
    drop() {
        return connection.dropDatabase();
    },
    getToken(user = { email: 'noemail@email.com', password: 'abc', name: 'me' }) {
        return request.post('/auth/signup')
            .send(user)
            .then(res => res.body.token);
    }
};