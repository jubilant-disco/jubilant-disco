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
                res.send(updatedUser);
            })
            .catch(next);
    })

    .get('/albums', (req, res, next) => {
        User.findById(req.user.id)
            .lean()
            .select('favAlbums')
            .then(albums => res.send(albums))
            .catch(next);
    });

// .delete('/:id/albums/:id', (req, res, next) => {
//     const userId = req.url.split('/')[1];
//     User.findByIdAndUpdate(userId, { $pull: { favAlbums: {_id: req.params.id} } }, { new: true } )
//         .then(response => {
//             res.send({ removed: response ? true : false});
//         })
//         .catch(next);
// });


module.exports = router;