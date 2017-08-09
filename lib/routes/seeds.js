const Router = require('express').Router;
const router = Router();
const superAgent = require('superagent');
const seedAlbum = require('../models/seed');

router
    .get('/:id', (req, res, next) => {
        // console.log('HERE: ',req);
        superAgent
            .get(`https://api.discogs.com/masters/${req.params.id}`)
            .then(results => res.send(results.body))
            .catch(next);
    })
    .post('/', (req, res, next) => {
        const album = new seedAlbum(req.body);
        album.save()
        .then(res => console.log(res))


        // console.log('in post: ',req.body)

    })

module.exports = router;