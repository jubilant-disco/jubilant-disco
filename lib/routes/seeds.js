const Router = require('express')
    .Router;
const router = Router();
const superAgent = require('superagent');
const seedUser = require('../models/seedUser');
const seedAlbum = require('../models/seedAlbum');


router
    .post('/albums', (req, res, next) => {
        const album = new seedAlbum(req.body);
        return album.save()
            .then(response => res.send(response))
            .catch(next);
    })
    .post('/users', (req, res, next) => {
        const user = new seedUser(req.body.user);
        return user.save()
            .then(response => res.send(response))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        console.log('here: ', `${req.params.id}`);
        return superAgent
            .get(`https://api.discogs.com/masters/${req.params.id}`)
            .then(results => {
                console.log(results);
                res.send(results.body)})
            .catch(next);
    })
    .get('/random', (req, res, next) => {
        return seedAlbum.aggregate([{ $sample: { size: 10 } }])
            .then(results => res.send(results))
    })

module.exports = router;