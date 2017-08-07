const connection = require('mongoose').connection;
const request = require('./request');
require('../../../lib/connect');



/* export a small helper for dropping the db*/
module.exports = {
    drop() {
        return connection.dropDatabase();
    },
    getToken(user = { email: 'me@me.com', password: 'abc' }) {
        return request.post('/auth/signup')
            .send(user)
            .then(res => res.body.token);
    }
};