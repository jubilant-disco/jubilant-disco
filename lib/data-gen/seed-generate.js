require('dotenv')
    .config();
const req = require('../../tests/e2e/helpers/request');
const albums = require('../../discogs-data/120albums');
const seedUsers = require('../../discogs-data/600userNames');
const db = require('../../tests/e2e/helpers/db');

let i = 0;
let j = 0;
// db.drop('users');
// db.drop('seedalbums');
db.dropDb();


setInterval(buildAlbumData, 4000);

function buildAlbumData() {
    if (i <= 30 && j <= 20) {
        console.log('i<=2 && j<=20 : ', i, j);
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
                    albumId: masterId,
                    rank: Math.floor(Math.random() * (11- 1)) + 1
                }
                return albumObj;
            })
            .then(obj => {
                // console.log('are these your albums??: ', obj);
                return req.post('/seeds/albums')
                    .send(obj)
                    .then(res => console.log('saved seed album to seedalbum collection: ', res.body))

            })
    } else if (j <= 4) {
        console.log('else: i>3 && j<=20:', i, j)
        buildUserData(j)
        j++;
    }

}

function buildUserData(j) {
    console.log('yo!: ', j)
    let userSeed = null;
    // let token = null;
    userSeed = seedUsers.users[j];


    // get ten seed albums
    // save ten seed albums
    // create dict on save


    return req.get('/seeds')
        .then(seedAlbums => {
            console.log(seedAlbums.body);
            userSeed.favAlbums = seedAlbums.body;
            return db.getToken(userSeed)
                .then(token => {
                    return req.put('/me/albums')
                        .set('Authorization', token)
                        .send(userSeed.favAlbums)
                        .then(dict => {
                            console.log('USERDICT: ', dict.body.dictionary)
                        })
                })

        })

}