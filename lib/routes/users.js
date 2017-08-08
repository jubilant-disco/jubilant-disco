const express = require('express');
const router = express.Router();
const User = require('../models/user');

router
    .get('/:id', (req, res, next) => {
        User.findById(req.params.id)
            .then(user => {
                if (!user) throw { code: 404, error: `${req.params.id} not found` };
                else res.send(user);
            })
            .catch(next);
    })

    .put('/:id/albums', (req, res, next) => {
        User.findByIdAndUpdate(req.params.id, { $set: { favAlbums: req.body } }, { new: true })
            .then(updatedUser => {
                res.send(updatedUser);
            })
            .catch(next);
    })

    .get('/:id/albums', (req, res, next) => {
        User.findById(req.params.id)
            .lean()
            .select('favAlbums')
            .then(albums => res.send(albums))
            .catch(next);
    })

    .delete('/:id/albums/:id', (req, res, next) => {
        console.log('REQ PARAMS IS', req.params);
        User.remove(req.params.id)
            .then(response => {
                res.send({ removed: response ? true : false});
            })
            .catch(next);
    });

module.exports = router;