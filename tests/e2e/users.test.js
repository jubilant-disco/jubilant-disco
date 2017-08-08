const db = require('./helpers/db');
const request = require('./helpers/request');
const assert = require('chai').assert;

describe('user routes', () => {
    beforeEach(db.drop);

    let token = null;
    before(() => db.getToken().then(t => token = t));

    let user = {
        name: 'me',
        email: 'jubilant@disco.com',
        password: 'abc'
    };

    function saveUser(user) {
        return request
            .post('/auth/save')
            .set('Authorization', token)
            .send(user)
            .then(res => res.body);
    }

    it('initial GET returns empty album list', () => {
        return saveUser(user)
            .then(savedUser => {
                user = savedUser;
                assert.ok(user._id, 'user has id');
                return user;
            })
            .then(user => {
                return request
                .get(`/users/${user._id}`)
                .set('Authorization', token)
            })
            .then(res => {
                console.log('LINE EIGHTEEN OF USERS TEST DOT JAY ESS', res.body);
                const user = res.body;
                assert.deepEqual(user.favAlbums, []);
            });
    });
});
