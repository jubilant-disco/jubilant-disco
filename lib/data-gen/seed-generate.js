require('dotenv').config({ path: '../../seeding.env' });
const req = require('../../tests/e2e/helpers/request');
const db = require('../../tests/e2e/helpers/db');
const superAgent = require('superagent');

// module.exports = function jubilantDiscoSeedUsers (initialAlbumId, albumSampleSize, userSampleSize) {
db.drop('users');
setInterval(buildAlbumData, 6000);
let albumsArr = [];

//config options
let initialAlbumId = 5000;
let albumSampleSize = 5;
let userSampleSize = 20;
const userSchema = require('./jubilant-disco-user.schema.json');
// userSchema built at mockaroo.com
// end config options

function buildAlbumData() {
    let albumsArr = [];
    let masterId = Math.trunc(Math.random() * ((initialAlbumId + albumSampleSize) - initialAlbumId) + initialAlbumId);
    console.log('masterId: ', masterId);
    return superAgent
        .get('https://api.discogs.com/masters/')
        .set('Authorization', { key: `${process.env.DISCOGS_CONSUMER_KEY}`, secret: `${process.env.DISCOGS_CONSUMER_SECRET}` })
        .send({ id: masterId })
        .then(res => {
            let albumObj = {
                title: res.body.title,
                artist: res.body.artists[0].name,
                genre: res.body.genres[0],
                albumId: masterId,
                rank: 0
            }
            albumsArr.push(albumObj);
            console.log('albumObj: ', albumObj);
            buildUserData()
        })

}


function buildUserData() {
    let seedUsers = {};
    return req.get('https://api.mockaroo.com/api/generate.json')
        .send({ key: `${process.env.MOCKAROO_API_KEY}`, count: userSampleSize, schema: userSchema })
        .then(res => seedUsers = res)
        .then(seedUsers => {
            for (let prop in seedUsers) {
                if (seedUsers.hasOwnProperty(prop)) {
                    console.log(prop, seedUsers[prop]);
                }
            }


        })
    // let m = 0;
    // let seedUser = seedUsers.users[j];
    // let numOfAlbums = Math.trunc(10*Math.random()+1)
    // let userAlbums = albumsArr.sort(() => .5 - Math.random())
    //     .slice(0, numOfAlbums);
    // userAlbums.forEach(album => { album.rank = m;
    //     m++; });
    // return db.getToken(seedUser)
    //     .then(token => {
    //         console.log(userAlbums);
    //         console.log(token);

    //     });

}

// }