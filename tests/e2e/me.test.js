const db = require('./helpers/db');
const request = require('./helpers/request');
const assert = require('chai').assert;
// const { execSync } = require('child_process');

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
        { albumId: 604271, artist: 'Nirvana', album: 'Nevermind', genre: 'Rock', rank: 1 },
        { albumId: 45526, artist: 'Marty Nelson', album: 'Sings Broadway', genre: 'Showtunes', rank: 2 },
        { albumId: 35276, artist: 'Kenny G', album: 'Christmas', genre: 'Christmas', rank: 3 },
        { albumId: 24497, artist: 'Dr. Dre', album: 'A Chronic Christmas', genre: 'Christmas Rap', rank: 4 },
        { albumId: 13814, artist: 'Led Zeppelin', album: 'IV', genre: 'Rock', rank: 5 },
        { albumId: 26725, artist: 'Miles Davis', album: 'Kind Of Blue', genre: 'Jazz', rank: 6 },
        { albumId: 163706, artist: 'Taco', album: 'Hungry For Tacos', genre: 'International', rank: 7 },
        { albumId: 86466, artist: 'Glen Campbell', album: 'Wichita Lineman', genre: 'Country', rank: 8 },
        { albumId: 1141287, artist: 'Dr. Dre featuring Kenny G', album: 'Greatest Hits', genre: 'Smooth Rap', rank: 9 },
        { albumId: 464021, artist: 'Motörhead', album: 'Ace Of Spades', genre: 'Metal', rank: 10 }
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

    const bob = {
        email: 'bob@jubilant-disco.com',
        name: 'bob',
        password: 'jubilantBob'
    };

    const bobAlbums = [
        { albumId: 604275, artist: 'John Coltrane', album: 'A Love Supreme', genre: 'Jazz', rank: 1 },
        { albumId: 45529, artist: 'Prince', album: '1999', genre: 'R&B', rank: 2 },
        { albumId: 35278, artist: 'Michael Jackson', album: 'Thriller', genre: 'R&B', rank: 3 },
        { albumId: 24498, artist: 'Elvis Presley', album: 'Elvis In Memphis', genre: 'Rock', rank: 4 },
        { albumId: 13818, artist: 'Willie Nelson', album: 'Shotgun Willie', genre: 'Country', rank: 5 },
        { albumId: 26728, artist: 'Dave Brubeck', album: 'Time Out', genre: 'Jazz', rank: 6 },
        { albumId: 16378, artist: 'Taco', album: 'Hungry For Tacos', genre: 'International', rank: 7 },
        { albumId: 86468, artist: 'Patsy Cline', album: 'Showcase', genre: 'Country', rank: 8 },
        { albumId: 1141288, artist: 'New Order', album: 'Low Life', genre: 'Alternative', rank: 9 },
        { albumId: 604271, artist: 'Nirvana', album: 'Nevermind', genre: 'Rock', rank: 10 }
    ];

    const meryl = {
        email: 'meryl@jubilant-disco.com',
        name: 'meryl',
        password: 'jubilantMeryl'
    };

    const merylAlbums = [
        { albumId: 604271, artist: 'The Cure', album: 'Disintegration', genre: 'Alternative', rank: 1 },
        { albumId: 45526, artist: 'Bruce Springsteen', album: 'Born To Run', genre: 'Rock', rank: 2 },
        { albumId: 86466, artist: 'Johnny Cash', album: 'The Man Comes Around', genre: 'Country', rank: 3 },
        { albumId: 24497, artist: 'Snoop Dogg', album: 'Doggystyle', genre: 'Rap', rank: 4 },
        { albumId: 13814, artist: 'Le Tigre', album: 'Le Tigre', genre: 'Alternative', rank: 5 },
        { albumId: 26725, artist: 'John Lee Hooker', album: 'Plays The Blues', genre: 'Blues', rank: 6 },
        { albumId: 163706, artist: 'MC Hammer', album: 'Please Hammer Dont Hurt Em', genre: 'Rap', rank: 7 },
        { albumId: 35276, artist: 'Kenny G', album: 'Christmas', genre: 'Christmas', rank: 8 },
        { albumId: 1141287, artist: 'Dave Brubeck', album: 'Time Further Out', genre: 'Jazz', rank: 9 },
        { albumId: 464021, artist: 'Metallica', album: 'Ride The Lightning', genre: 'Metal', rank: 9 }
    ];

    const lewisTheDog = {
        email: 'lewisTheDog@jubilant-disco.com',
        name: 'lewisTheDog',
        password: 'jubilantLewisTheDog'
    };

    const lewisTheDogAlbums = [
        { albumId: 45526, artist: 'Marty Nelson', album: 'Sings Broadway', genre: 'Showtunes', rank: 1 },
        { albumId: 604271, artist: 'Ramones', album: 'Ramones', genre: 'Rock', rank: 2 },
        { albumId: 35276, artist: 'The Cure', album: 'Seventeen Seconds', genre: 'Alternative', rank: 3 },
        { albumId: 24497, artist: 'Barking Dogs', album: 'Sing Jingle Bells', genre: 'Christmas', rank: 4 },
        { albumId: 13814, artist: 'Led Zeppelin', album: 'Houses Of The Holy', genre: 'Rock', rank: 5 },
        { albumId: 26725, artist: 'Miles Davis', album: 'In A Silent Way', genre: 'Jazz', rank: 6 },
        { albumId: 163706, artist: 'The Beatles', album: 'Abbey Road', genre: 'Rock', rank: 7 },
        { albumId: 86466, artist: 'Los Perros', album: 'Uno, Dos, Tres', genre: 'International', rank: 8 },
        { albumId: 1141287, artist: 'Boards Of Canada', album: 'Music Has The Right To Children', genre: 'Electronic', rank: 9 },
        { albumId: 464021, artist: 'Prince', album: 'Purple Rain', genre: 'R&B', rank: 10 }
    ];

    const wendy = {
        email: 'Wendy@jubilant-disco.com',
        name: 'Wendy',
        password: 'jubilantWendy'
    };

    const wendyAlbums = [
        { albumId: 24047, artist:'The Beatles', album:'Abbey Road',genre: 'Rock', rank: 1},
        { albumId: 3986, artist: 'Bob Dylan', album: 'Highway 61 Revisited', genre: 'Rock', rank: 2},
        { albumId: 30303, artist: 'The Rolling Stones', album: 'Exile On Main St.', genre: 'Rock', rank: 3},
        { albumId: 3773, artist: 'Bob Dylan', album: 'Blonde on Blonde', genre: 'Rock', rank: 4},
        { albumId: 3878, artist: 'Bob Dylan', album: 'Blood On The Tracks', genre: 'Rock', rank: 5},
        { albumId: 5460, artist: 'Miles Davis', album: 'Kind Of Blue', genre: 'Jazz', rank: 6},
        { albumId: 14541, artist: 'Van Morrison', album: 'Astral Weeks', genre: 'Jazz', rank: 7},
        { albumId: 1141287, artist: 'Boards Of Canada', album: 'Music Has The Right To Children', genre: 'Electronic', rank: 8 },
        { albumId: 55666, artist: 'Portishead', album: 'Dummy', genre: 'Electronic', rank: 9 },
        { albumId: 12349, artist: 'Michael Jackson', album: 'Off The Wall', genre: 'R&B', rank: 10}
    ];

    //     const lewisAlbums = [
    // { albumId: 26725, artist:'Bruce Springsteen', album:'Born To Run',genre: 'Rock', rank: 1},
    // { albumId: 45284, artist: 'The Beatles', album: 'Revolver', genre: 'Rock', rank: 2},
    // { albumId: 14541, artist: 'Van Morrison', album: 'Astral Weeks', genre: 'Jazz', rank: 3},
    // { albumId: 23934, artist: 'The Beatles', album: 'Sgt. Pepper's Lonely Hearts Club Band', genre: 'Rock', rank: 4},
    // { albumId: 3878, artist: 'Bob Dylan', album: 'Blood On The Tracks', genre: 'Rock', rank: 5},
    // { albumId: 45526, artist: 'The Beatles', album: 'Rubber Soul', genre: 'Rock', rank: 6},
    // { albumId: 107699, artist: 'The Rolling Stones', album: 'Exile On Main St.', genre: 'Rock', rank: 7},

    function saveAndAdd(user, userAlbums) {
        return saveUser(user)
            .then(() => {
                // const savedUser = res.body.userObj.user;
                // savedUser.favAlbums = userAlbums;
                return request.put('/me/albums')
                    .set('Authorization', token)
                    .send(userAlbums);
            });
    }

    it('makes a bunch of users', () => {
        return Promise.all([
            saveAndAdd(bob, bobAlbums),
            saveAndAdd(meryl, merylAlbums),
            saveAndAdd(lewisTheDog, lewisTheDogAlbums),
            saveAndAdd(wendy, wendyAlbums)
        ])
            .then(() => request.get('/users'))
            .then(res => {
                console.log('res.body', res.body);
                assert.ok(res.body);
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

    let myArtistArr = [];

    it('gets matches', () => {
        return request.get('/me/matches')
            .set('Authorization', token)
            .then(res => {
                myArtistArr = res.body;
                console.log('myArtistArr', myArtistArr);
                assert.ok(myArtistArr);
            });
    });

});