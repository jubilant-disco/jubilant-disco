require('dotenv')
    .config();
const req = require('../../tests/e2e/helpers/request');
const albums = require('../../discogs-data/120albums');
const seedUsers = require('../../discogs-data/600userNames');
const db = require('../../tests/e2e/helpers/db');

let i = 0;
db.drop('users');
// db.drop('seedalbums');


// setInterval(buildAlbumData, 6000);

function buildAlbumData() {
    if (i <= 20) {
        let masterId = albums.items[i].id;
        i++;
        return req.get('/seeds')
            .set('Authorization', { key: `${process.env.DISCOGS_CONSUMER_KEY}`, secret: `${process.env.DISCOGS_CONSUMER_SECRET}` })
            .send({ id: masterId })
            .then(res => {
                const albumObj = {
                    album: res.body.title,
                    artist: res.body.artists[0].name,
                    genre: res.body.genres[0],
                    albumId: masterId
                }
                return albumObj;
            })
            .then(obj => {
                return req.post('/seeds/albums')
                    .send(obj)
                    .then(res => console.log(res.status))
            })
    } else {
        for (let j = 0; j <= 14; j++) {
            buildUserData(j)
        }
    }
}
for (let j = 0; j <= 20; j++) {
    buildUserData(j)
}

function buildUserData(j) {
    let userSeed = null;
    userSeed = seedUsers.users[j];
    return req.get('/seeds')
        .then(res => {
            userSeed.favAlbums = res.body;
            return userSeed;
        })
        .then(user => {
            return req.post('/seeds/users')
                .send({ user })
                .then(res => console.log(res.status))
        })

}