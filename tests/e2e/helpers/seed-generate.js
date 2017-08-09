const req = require('./request');
const albums = require('../../../discogs-data/100albums');

for (let i = 0; i < 1; i++) {
    let masterId = albums.items[i].id;
    buildAlbumData(masterId)
        .then(res => console.log(res))
}

function buildAlbumData(masterId) {
    return req.get(`/seeds/${masterId}`)
        .set('Authorization', {key:'fCoUCDJwscUNWfhQPUxS', secret: 'UlurrruRvEhpdUGbyijsjwzyxBMMcKmX'})
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
            console.log('afterget: ',obj)
            return req.post('/seeds')
                .send(obj)
                .then(res => {})
        })
}
