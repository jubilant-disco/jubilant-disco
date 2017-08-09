const db = require('./helpers/db');
const request = require('./helpers/request');
const assert = require('chai').assert;

describe('user routes', () => {
    before(() => db.drop('users'));


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
            .then(savedToken => {
                return request.post('/auth/signin')
                    .set('Authorization', savedToken)
                    .send(user);
            });
    }

    it('initial GET returns empty album list', () => {
        return saveUser(user)
            .then(res => {
                // const user = res.body.userObj.user;
                const token = res.body.userObj.token;
                return request.get('/me')
                    .set('Authorization', token)
                    .then(res => {
                        const user = res.body;
                        assert.deepEqual(user.favAlbums, []);
                    });
            });
    });

    const joe = {
        email: 'joe@jubilant-disco.com',
        name: 'Joe',
        password: 'jubilantJoe'
    };

    const joeAlbums = [
        {
            albumId: 604271,
            rank: 1
        },
        {
            albumId: 45526,
            rank: 2
        },
        {
            albumId: 35276,
            rank: 3
        },
        {
            albumId: 24497,
            rank: 4
        },
        {
            albumId: 13814,
            rank: 5
        },
        {
            albumId: 26725,
            rank: 6
        },
        {
            albumId: 163706,
            rank: 7
        },
        {
            albumId: 86466,
            rank: 8
        },
        {
            albumId: 1141287,
            rank: 9
        },
        {
            albumId: 464021,
            rank: 10
        }
    ];

    it('creates a new user with 10 albums', () => {
        return saveUser(joe)
            .then(res => {
                const savedJoe = res.body.userObj.user;
                savedJoe.favAlbums = joeAlbums;
                joe._id = savedJoe._id;
                return request.put('/me/albums')
                    .set('Authorization', token)
                    .send(joeAlbums);
            })
            .then(res => res.body)
            .then(updated => {
                assert.ok(updated.favAlbums.length);
                updated.favAlbums.forEach((album, i) => {
                    assert.equal(album.albumId, joeAlbums[i].albumId);
                    assert.equal(album.rank, joeAlbums[i].rank);
                });
            });
    });

    it('gets a users albums', () => {
        return request.get('/me/albums')
            .set('Authorization', token)
            .then(res => {
                joe.favAlbums = res.body.favAlbums;
                assert.equal(res.body.favAlbums.length, joeAlbums.length);
            });
    });

    // it('removes an album from user favAlbums array', () => {
    //     return request.delete(`/me/${joe._id}/albums/${joe.favAlbums[1]._id}`)
    //         .set('Authorization', token)
    //         .then(res => res.body)
    //         .then(result => {
    //             assert.isTrue(result.removed);
    //         });
    // });

});