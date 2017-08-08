const db = require('./helpers/db');
const request = require('./helpers/request');
const testHelpers = require('./helpers/testHelpers');
const {
    assert
} = require('chai');

describe.only('auth', () => {
    beforeEach(db.drop);

    let user = {
        name: 'user',
        email: 'me@me.com',
        password: 'abc'
    };

    describe('user management', () => {

        const badRequest = (url, data, code, error) => {
            request
                .post(url)
                .send(data)
                .then(
                    () => {
                        throw new Error('status should not be okay');
                    },
                    res => {
                        assert.equal(res.code, 400);
                        assert.equal(res.error, 'Both email and password are required.');
                    }
                );
        };

        it('signup requires password', () =>
            badRequest('/auth/signup', {
                email: 'abc'
            }, 400, 'Both email and password are required.')
        );

        let token = '';

        it('signup', () =>
            request
                .post('/auth/signup')
                .send(user)
                .then(res => assert.ok(token = res.body.token))
        );

        it('cant use the same email', () =>
            badRequest('/auth/signup', user, 400, 'email in use')
        );

        it('signin requires email', () =>
            badRequest('/auth/signin', {
                password: 'abc'
            }, 400, 'Both email and password are required.')
        );

        it('signin requires password', () =>
            badRequest('/auth/signin', {
                email: 'abc'
            }, 400, 'Both email and password are required.')
        );

        it('signin with wrong user', () =>
            badRequest('/auth/signin', {
                email: 'bad user',
                password: user.password
            }, 400, 'Invalid Login')
        );

        it('signin with wrong password', () =>
            badRequest('/auth/signin', {
                email: user.email,
                password: 'bad password'
            }, 400, 'Invalid Login')
        );

        it.only('signin', () => {
            return testHelpers.saveUser(user)
                .then(token => {
                    user.token = token;
                    return request
                        .post('/auth/signin')
                        .send(user)
                        .then(res => assert.ok(res.body.token));
                });

        });

        it.skip('token is invalid', () =>
            request
                .get('/verify')
                .set('Authorization', 'bad token')
                .then(
                    () => {
                        throw new Error('success response not expected');
                    },
                    (res) => {
                        assert.equal(res.status, 401);
                    }
                )
        );

        it.skip('token is valid', () =>
            request
                .get('/verify')
                .set('Authorization', token)
                .then(res => assert.ok(res.body))
        );
    });

});