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
            artist: 'Nirvana',
            album: 'Nevermind',
            genre: 'Rock',
            rank: 1
        },
        {
            albumId: 45526,
            artist: 'Marty Nelson',
            album: 'Sings Broadway',
            genre: 'Showtunes',
            rank: 2
        },
        {
            albumId: 35276,
            artist: 'Kenny G',
            album: 'Christmas',
            genre: 'Christmas',
            rank: 3
        },
        {
            albumId: 24497,
            artist: 'Dr. Dre',
            album: 'A Chronic Christmas',
            genre: 'Christmas Rap',
            rank: 4
        },
        {
            albumId: 13814,
            artist: 'Led Zeppelin',
            album: 'IV',
            genre: 'Rock',
            rank: 5
        },
        {
            albumId: 26725,
            artist: 'Miles Davis',
            album: 'Kind Of Blue',
            genre: 'Jazz',
            rank: 6
        },
        {
            albumId: 163706,
            artist: 'Taco',
            album: 'Hungry For Tacos',
            genre: 'International',
            rank: 7
        },
        {
            albumId: 86466,
            artist: 'Glen Campbell',
            album: 'Wichita Lineman',
            genre: 'Country',
            rank: 8
        },
        {
            albumId: 1141287,
            artist: 'Dr. Dre featuring Kenny G',
            album: 'Greatest Hits',
            genre: 'Smooth Rap',
            rank: 9
        },
        {
            albumId: 464021,
            artist: 'Motörhead',
            album: 'Ace Of Spades',
            genre: 'Metal',
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

    let allUsers = null;

    it('gets all users', () => {
        return request.get('/users')
            .set('Authorization', token)
            .then(res => {
                allUsers = res.body;
                console.log('allUsers', allUsers);
                assert.ok(allUsers);
            });
    });

    let artistArr = [];

    it('gets matches', () => {
        return request.get('/me/matches')
            .set('Authorization', token)
            .then(res => {
                artistArr = res.body;
                console.log('artistArr', artistArr);
                assert.ok(artistArr);
            });
    });

});