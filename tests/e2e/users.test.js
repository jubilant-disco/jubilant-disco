const db = require('./helpers/db');
const request = require('./helpers/request');
const assert = require('chai').assert;

describe('user routes', () => {
    before(db.drop);

    let token = null;
    before(() => db.getToken().then(t => token = t));

    let user = {
        name: 'sally',
        email: 'jubilant@disco.com',
        password: 'xyz'
    };

    function saveUser(user) {
        return request
            .post('/auth/signup')
            .set('Authorization', token)
            .send(user)
            .then(res => res.body);
    }

    it('initial GET returns empty album list', () => {
        return saveUser(user)
            .then(savedToken => {
                return request.post('/auth/signin')
                    .set('Authorization', savedToken)
                    .send(user)
                    .then(userObj => {
                        const user = userObj.body.userObj.user;
                        const token = userObj.body.userObj.token;
                        return request.get(`/users/${user._id}`)
                            .set('Authorization', token)
                            .then(res => {
                                const user = res.body;
                                assert.deepEqual(user.favAlbums, []);
                            });
                    });
            });
    });
});