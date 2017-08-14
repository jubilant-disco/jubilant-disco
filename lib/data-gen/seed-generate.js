require('dotenv')
    .config('./.env');
const req = require('../tests/e2e/helpers/request');
const db = require('../tests/e2e/helpers/db');
const superAgent = require('superagent');
const userList = require('./jubilant-disco-users'); //when maxed out on free daily api requests, use saved data

db.drop('users');
//config options
let firstAlbumId = 5000;
let albumSampleSize = 10;
let userSampleSize = 5;
const userSchema = "jubilant-disco-user";
// userSchema built and stored at mockaroo.com
// end config options

let albumsArr = [];
let uniqueArr = [];
let masterIds = makeUniqueAlbumIds(uniqueArr);
let i = 0;
let usersSaved = 0;
let intervalId = setInterval(buildAlbumData, 8000);

function buildAlbumData() {
    if (i < albumSampleSize) {
        let masterId = masterIds[i];
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
                console.log('albums in array: ', albumsArr.length, albumObj);
                i++;
            })
    } else {
        clearInterval(intervalId);
        buildUserData();
    }
}

function buildUserData() {
    return superAgent
        .post(`http://api.mockaroo.com/api/generate.json`)
        .query({ key: `${process.env.MOCKAROO_API_KEY}`, count: userSampleSize, schema: userSchema })
        .set('Content-type', 'application/json')
        .then(res => {
            if (res.status !== 200) {
                console.log(res.status, res.response.body);
                return userList['users'];
            } else {
                return res.body;
            }
        })
        .then(seedUsers => {
            seedUsers.forEach(user => {
                let m = 1;
                let numOfAlbums = Math.trunc(10 * Math.random() + 1)
                let favAlbums = albumsArr.sort(() => .5 - Math.random())
                    .slice(0, numOfAlbums);
                favAlbums.forEach(album => {
                    album.rank = m;
                    m++;
                })
                return db.getToken(user)
                    .then(token => {
                        return req.put('/me/albums')
                            .set('Authorization', token)
                            .send(favAlbums)
                            .then(res => {
                                console.log('users saved: ', res.body, ++usersSaved)

                                return req.get('/me/matches')
                                    .set('Authorization', token)
                                    .then(matches => {
                                        console.log(res.body.name);
                                        console.log(res.body.favAlbums);
                                        console.log('MATCHES: ', matches.body);
                                        console.log();
                                    })
                            })

                    })
                    .catch();
            })

        })

}

function makeUniqueAlbumIds(uniqueArr) {
    do {
        let masterId = Math.trunc(Math.random() * ((firstAlbumId + albumSampleSize) - firstAlbumId) + firstAlbumId);
        if (uniqueArr.indexOf(masterId) < 0) uniqueArr.push(masterId);
        else makeUniqueAlbumIds(uniqueArr);
    }
    while (uniqueArr.length < albumSampleSize)
    return uniqueArr;
}