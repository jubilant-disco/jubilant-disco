require('dotenv')
    .config('./.env');
const req = require('../../tests/e2e/helpers/request');
const db = require('../../tests/e2e/helpers/db');
const superAgent = require('superagent');
const seedUsers = require('./jubilant-disco-user'); //maxed out on free daily api requests, using saved data

db.drop('users');
setInterval(buildAlbumData, 6000);
let albumsArr = [];
let i = 0;
let j = 0;
let usersSaved = 0;

//config options
let firstAlbumId = 4000;
let albumSampleSize = 2;
let userSampleSize = 20;
const userSchema = "jubilant-disco-user";
// TODO check album ids to ensure no dupes
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
                console.log('albumObj: ', albumObj);
                albumsArr.push(albumObj);
            })
    } else buildUserData()
}


function buildUserData() {
    let user = {};
    let m = 1;
    if (j < userSampleSize) {
        j++;
        // return req
        //     .post('https://api.mockaroo.com/api/generate.json')
        //     .query({ key: `${process.env.MOCKAROO_API_KEY}`, count: userSampleSize, schema: userSchema })
        //     .then(seedUsers => {
        //          user = seedUser.body;
        // console.log('SEEDUSERS: ', seedUsers, typeof seedUsers);
        //
        // console.log("USER: ", user);
        // console.log('HMMMMM: ', Object.entries(seedUsers));
        // if(seedUsers.hasOwnProperty)
        // for (let user in seedUsers) {
        // console.log("WTF: ", typeof seedUsers);
        // }
        console.log('MMKNKNNKNLKNLKN: ',typeof seedUsers, seedUsers)
        for (let user in seedUsers) {
            console.log('FA!!!: ', user);

            let numOfAlbums = Math.trunc(10 * Math.random() + 1)
            let favAlbums = albumsArr.sort(() => .5 - Math.random())
                .slice(0, numOfAlbums);
            user.favAlbums = favAlbums;
            console.log('FA: ', user);

            // console.log("IM A USER: ", user );
            // user.favAlbums.forEach(album => {
            //     album.rank = m;
            //     m++;
            // })
            // return db.getToken(user)
            //     .then(token => {
            //         console.log('TU: ', user);
            //         return req.put('/me/albums')
            //             .set('Authorization', token)
            //             .send(user.favAlbums)
            //             .then(console.log(usersSaved++))

            //     })



            // }




            //     })


            // })


        }
    }
}
// }