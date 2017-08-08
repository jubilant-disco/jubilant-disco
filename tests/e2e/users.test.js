const db = require('./helpers/db');
const request = require('./helpers/request');
const testHelpers = require('./helpers/testHelpers');
const assert = require('chai').assert;

describe('user routes', () => {
    before(db.drop);

    const user = {
        name: 'me',
        email: 'me@me.com',
        password: 'abc'
    };

    it.only('initial GET returns empty album list', () => {
        return testHelpers.saveUser(user)
            .then(savedUser => {
                console.log('LINE EIGHTEEN OF USERS TEST DOT JAY ESS', savedUser);
                console.log('LINE NINETEEN THIS TIME', user);
                return request.get(`/users/${user._id}`)
                    .set('Authorization', user.token);
            })
            .then(res => {
                const user = res.body;
                assert.deepEqual(user.favAlbums, []);
            });    
    });
});