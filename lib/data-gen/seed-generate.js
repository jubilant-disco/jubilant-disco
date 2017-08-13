require('dotenv').config({ path: '../../seeding.env' })
// require('../connect');
const req = require('../../tests/e2e/helpers/request');
const db = require('../../tests/e2e/helpers/db');

db.drop('users');
setInterval(buildAlbumData, 6000);
let albumsArr = [];

//config options
let initialAlbumId = 5000;
let albumSampleSize = 120;
let userSampleSize = 600;
const userSchema = require('./jubilant-disco-user.schema.json');
// userSchema built at mockaroo.com
// end config options

function buildAlbumData() {
    let albumsArr = [];
    let masterId = getRandomInt(initialAlbumId, albumSampleSize);
    return req.get('/seeds')
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
    // let numOfAlbums = getRandomInt(1, 11);
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}