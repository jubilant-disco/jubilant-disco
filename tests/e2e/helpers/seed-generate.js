require('dotenv')
    .config();
const req = require('./request');
const albums = require('../../../discogs-data/120albums');
const seedUsers = require('../../../discogs-data/120userNames');
const db = require('./db');

let i = 0;
db.drop();

setInterval(buildAlbumData, 10000);

function buildAlbumData() {
    if (i <= 120) {
        let masterId = albums.items[i].id;
        i++;
        return req.get('/seeds')
            .set('Authorization', { key: `${process.env.DISCOGS_CONSUMER_KEY}`, secret: `${process.env.DISCOGS_CONSUMER_SECRET}` })
            .send({ id: masterId })
            .then(res => {
                // console.log(res);
                const albumObj = {
                    title: res.body.title,
                    artist: res.body.artists[0].name,
                    genre: res.body.genres,
                    discogsMasterId: masterId,
                    discogMasterUrl: res.body.resource_url
                }
                return albumObj
            })
            .then(obj => {
                return req.post('/seeds/albums')
                    .send(obj)
                    .then(res => console.log(res.status))
            })

    } else {
        for (let j = 0; j <= 120; j++) {

            buildUserData(j)
        }
    }

}


// buildUserData()
//
function buildUserData(j) {
    // console.log(seedUsers.users)

    let userSeed = null;
    userSeed = seedUsers.users[j];
    return req.get('/seeds')
        .then(res => {
            userSeed.favAlbums = res.body;
            // console.log(userSeed);
            return userSeed;
        })
        .then(user => {
            // userSeed = user;
            // console.log(user);
            return req.post('/seeds/users')
                .send({ user })
            // .then(res => console.log(res.status))
        })

}