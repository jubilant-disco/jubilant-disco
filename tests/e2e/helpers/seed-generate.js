require('dotenv')
    .config();
const req = require('./request');
const albums = require('../../../discogs-data/120albums');
const db = require('./db');


let i = 0;
db.drop();

setInterval(buildAlbumData, 8000);


function buildAlbumData() {
    if (i <= albums.items.length) {

        let masterId = albums.items[i].id;
        i++;
        return req.get(`/seeds/${masterId}`)
            .set('Authorization', { key: `${process.env.DISCOGS_CONSUMER_KEY}`, secret: `${process.env.DISCOGS_CONSUMER_SECRET}` })
            .then(res => {
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
                return req.post('/seeds')
                    .send(obj)
                    .then(res => console.log(res.status))
            })
    }
}