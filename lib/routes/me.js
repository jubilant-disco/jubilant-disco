const express = require('express');
const router = express.Router();
const User = require('../models/user');

router
    .get('/', (req, res, next) => {
        User.findById(req.user.id)
            .then(user => {
                if (!user) throw { code: 404, error: `${req.user.id} not found` };
                else res.send(user);
            })
            .catch(next);
    })

    .put('/albums', (req, res, next) => {
        User.findByIdAndUpdate(req.user.id, { $set: { favAlbums: req.body } }, { new: true })
            .then(updatedUser => {
                return User.getMyDictionary(updatedUser._id, updatedUser.favAlbums);
            })
            .then(userDict => {
                return User.findByIdAndUpdate(req.user.id, { $set: { dictionary: userDict } }, { new: true });
            })
            .then(userWithDict => {
                res.send(userWithDict);
            })
            .catch(next);
    })

    .get('/albums', (req, res, next) => {
        User.getAlbums(req.user.id)
            .then(albums => res.send(albums))
            .catch(next);
    })

    .get('/matches', (req, res, next) => {
        User.getDictionaries(req.user.id)
            .then(response => {
                return User.calculateMatches(response, req.user.id);
            })
            .then(match => {
                res.send(match);
            })
            .catch(next);
    });

module.exports = router;