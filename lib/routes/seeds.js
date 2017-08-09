const Router = require('express')
    .Router;
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
        console.log(album);
        return album.save()
            .then(response => res.send(response))
            .catch(next);
    })
    .get('/random', (req, res, next) => {
        // get 10 random albums for the user
        // db.products.aggregate([{$sample: {size: 10}}]);
        return seedUser.aggregate([{$sample: {size: 10}}])
            .then(res => {
                console.log(res);
            })


    })

module.exports = router;