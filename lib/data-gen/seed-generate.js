require('dotenv')
    .config('./.env');
const req = require('../../tests/e2e/helpers/request');
const db = require('../../tests/e2e/helpers/db');
const superAgent = require('superagent');
const userList = require('./jubilant-disco-users'); //when maxed out on free daily api requests, use saved data

db.drop('users');
// setInterval(buildAlbumData, 6000);
let albumsArr = [];
let i = 0;
let j = 0;
let usersSaved = 0;

//config options
let firstAlbumId = 4000;
let albumSampleSize = 4;
let userSampleSize = 20;
const userSchema = "jubilant-disco-user";
// TODO check album ids to ensure no dupes
// userSchema built and stored at mockaroo.com
// end config options
buildUserData()

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
// var request = require("request");

// var options = {
//     method: 'POST',
//     url: 'http://api.mockaroo.com/api/generate.json',
//     qs: { key: 'f5b8c5d0', count: '20', schema: 'jubilant-disco-user' },
//     headers: {
//         'postman-token': '33c27dbc-f251-5bac-fd43-6af82975b305',
//         'cache-control': 'no-cache',
//         'content-type': 'application/json'
//     }
// };

// request(options, function(error, response, body) {
//     if (error) throw new Error(error);

//     console.log(body);
// });

function buildUserData() {
    return superAgent
        .post(`http://api.mockaroo.com/api/generate.json`)
        .query({ key: `${process.env.MOCKAROO_API_KEY}`, count: userSampleSize, schema: userSchema })
        .set('Content-type', 'application/json')
        .catch(res => {
            if (res.status !== 200) {
                console.log(res.status, res.response.body);
                return userList['users'];
            } else {
                return res;
            }
        })
        .then(seedUsers => {
            if (j < userSampleSize) {
                j++;
                let user = seedUsers[j];
                let numOfAlbums = Math.trunc(10 * Math.random() + 1)
                let favAlbums = albumsArr.sort(() => .5 - Math.random()).slice(0, numOfAlbums);
                user.favAlbums = favAlbums;
                user.favAlbums.forEach(album => {
                    album.rank = m;
                    m++;
                })

                console.log('FA: ', user);

            }
        })

}


// if (j < userSampleSize) {
//     j++;
//     console.log('USERDATA: ',seedUsers);
// user = seedUsers['users'];
// console.log('USERS: ', seedUsers.users);
// for (let user in seedUsers['users']) {
// console.log('a user: ', seedUsers['users'][1])
// }
// console.log('a user: ', seedUsers['users'][j])
// console.log(typeof seedUsers, Object.keys(seedUsers));
// for (var [key, value] of Object.entries(seedUsers.users)) {
// console.log(key + ' ' + seedUsers.users.value); // "a 5", "b 7", "c 9"
// }
// for (let tmp )
// console.log('user: ', j, user[j])
// console.log('ARR: ', albumsArr)
// let numOfAlbums = Math.trunc(10 * Math.random() + 1)
// console.log(numOfAlbums)
// let favAlbums = albumsArr.sort(() => .5 - Math.random()).slice(0, numOfAlbums);
// console.log(favAlbums)
// // user.favAlbums = favAlbums;
// console.log('FA: ', user);

// user.favAlbums.forEach(album => {
//     album.rank = m;
//     m++;
// })








// }
// }

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


// }
// })



// }