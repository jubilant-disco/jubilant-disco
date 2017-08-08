const express = require('express');
const router = express.Router();
const User = require('../models/user');

router
    .get('/:id', (req, res, next) => {
        User.findById(req.params.id)
            .then(user => {
                if(!user) throw {code: 404, error: `${req.params.id} not found`};
                else res.send(user);
            })
            .catch(next);
    })

    .put('/:id/albums', (req, res, next) => {
        // const {id, favAlbums} = req.body;
        delete req.body.password;
        User.findByIdAndUpdate(req.params.id, {$set: {favAlbums: req.body}}, {new:true})
            .then(updatedUser => {
                res.send(updatedUser);
            })
            .catch(next);
    });

module.exports = router;