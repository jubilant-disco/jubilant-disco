const request = require('../helpers/request');
const assert = require('chai')
    .assert;

describe.skip('user routes', () => {
    // before(() => db.drop('users'));

    let token = null;

    const joe = {
        email: 'joe@jubilant-disco.com',
        name: 'Joe',
        password: 'jubilantJoe'
    };

    const noAlbumUser = {
        email: 'no-albums@jubilant-disco.com',
        password: 'abc',
        name: 'No Album Discoer'

    }

    const tenAlbumUser = {
        email: 'ten-albums@jubilant-disco.com',
        password: 'abc',
        name: 'Ten Album Discoer'

    }

    // before(() => db.getToken(joe)
    //     .then(t => token = t));

    it('initial GET returns empty album list', () => {
        return request.get('/me')
            .set('Authorization', token)
            .then(res => {
                const noAlbumUser = res.body;
                assert.deepEqual(noAlbumUser.favAlbums, []);
            });
    });

    const joeAlbums = [{
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
        return request.get('/auth/signup')
            .send(tenAlbumUser)
            .then(res => {
                const savedTenAlbumUser = res.body.userObj.user;
                const newToken = res.body.userObj.token;
                savedTenAlbumUser.favAlbums = joeAlbums;
                // joe._id = savedTenAlbumUser._id;
                return request.put('/me/albums')
                    .set('Authorization', newToken)
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

});