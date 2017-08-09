const Router = require('express')
    .Router;
const router = Router();
const superAgent = require('superagent');
const User = require('../models/user');
const seedAlbum = require('../models/seedAlbum');

router
    .post('/albums', (req, res, next) => {
        const album = new seedAlbum(req.body);
        return album.save()
            .then(response => res.send(response))
            .catch(next);
    })
    .post('/users', (req, res, next) => {
        const user = new User(req.body.user);
        return user.save()
            .then(response => res.send(response))
            .catch(next);
    })
    .get('/', (req, res, next) => {
        if (req.body.id) {
            return superAgent
                .get(`https://api.discogs.com/masters/${req.body.id}`)
                .then(results => {
                    // console.log(results);
                    res.send(results.body)
                })
                .catch(next);
        } else {
            return seedAlbum.aggregate([{ $sample: { size: 10 } }])
                .then(results => res.send(results))
                .catch(next);
        }
    })

module.exports = router;