const connection = require('mongoose')
    .connection;
const request = require('./request');
process.env.MONGODB_URI = 'mongodb://localhost:27017/jubilant-disco-seeding'
require('../../../lib/connect');
const state = require('mongoose/lib/connectionstate');

module.exports = {
    drop(name) {
        return new Promise((resolve, reject) => {
            function dropCollection() {
                const collection = connection.collection(name);
                if (collection) {
                    connection.db.dropCollection(name)
                        .then(resolve)
                        .catch(err => {
                            if (err.name !== 'MongoError' || err.message !== 'ns not found') reject(err);
                            else resolve();
                        })
                } else {
                    resolve();
                }
            }
            if (connection.readyState === state.connected) dropCollection()
            else connection.on('connected', dropCollection);
        })
    },
    dropDb() {
        return connection.dropDatabase();
    },
    getToken(user = { email: 'me@me.com', password: 'abc', name: 'me' }) {
        return request.post('/auth/signup')
            .send(user)
            .then(res => res.body.token);
    }
}