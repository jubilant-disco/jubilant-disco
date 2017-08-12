const Router = require('express')
    .Router;
const router = Router();
const superAgent = require('superagent');
const seedAlbum = require('../models/seedAlbum');

router
    .get('/', (req, res, next) => {
        if (req.body.id) {
            return superAgent
                .get(`https://api.discogs.com/masters/${req.body.id}`)
                .then(results => {
                    res.send(results.body);
                })
                .catch(next);
        } else {
            return seedAlbum.aggregate([{ $sample: { size: 10 } }])
                .then(results => res.send(results))
                .catch(next);
        }
    })

module.exports = router;