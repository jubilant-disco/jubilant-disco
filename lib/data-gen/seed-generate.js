require('dotenv')
    .config('./.env');
const req = require('../../tests/e2e/helpers/request');
const db = require('../../tests/e2e/helpers/db');
const superAgent = require('superagent');

db.drop('users');
setInterval(buildAlbumData, 6000);
let albumsArr = [];
let i = 0;
let j = 0;

//config options
let firstAlbumId = 5000;
let albumSampleSize = 1;
let userSampleSize = 2;
const userSchema = "jubilant-disco-user";
// userSchema built and stored at mockaroo.com
// end config options

function buildAlbumData() {
    if (i < albumSampleSize) {
        i++;
        let masterId = Math.trunc(Math.random() * ((firstAlbumId + albumSampleSize) - firstAlbumId) + firstAlbumId);
        return superAgent
            .get(`https://api.discogs.com/masters/${masterId}`)
            .then(res => {
                let albumObj = {
                    title: res.body.title,
                    artist: res.body.artists[0].name,
                    genre: res.body.genres[0],
                    albumId: masterId,
                    rank: 0
                }
                albumsArr.push(albumObj);
            })
    } else buildUserData()
}


function buildUserData() {
    if (j < userSampleSize) {
        j++;
        return superAgent
            .post('http://api.mockaroo.com/api/generate.json')
            .query({ key: `${process.env.MOCKAROO_API_KEY}`, count: userSampleSize, schema: userSchema })
            .then(seedUsers => {
                for (let prop in seedUsers.body) {
                    if (seedUsers.body.hasOwnProperty(prop)) {
                        let user = seedUsers.body[prop];
                        return db.getToken(user)
                            .then(token => {
                                let m = 1;
                                let numOfAlbums = Math.trunc(10 * Math.random() + 1)
                                user.favAlbums = albumsArr.sort(() => .5 - Math.random())
                                    .slice(0, numOfAlbums);
                                user.favAlbums.forEach(album => {
                                    album.rank = m;
                                    m++;
                                })
                                return req.put('/me/albums')
                                    .set('Authorization', token)
                                    .send(user.favAlbums)
                                    .then(console.log('success'))

                            })


                    }

                }
            })
    }
}