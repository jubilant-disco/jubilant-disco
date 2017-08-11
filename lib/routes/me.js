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
        console.log('IN PUT ALBUMS: ', req.body);
        User.findByIdAndUpdate(req.user.id, { $set: { favAlbums: req.body } }, { new: true })
            .then(updatedUser => {
                console.log('updateduser: ',updatedUser);
                User.getMyDictionary(updatedUser._id, updatedUser.favAlbums)
                    .then(userDict => {
                        console.log('USER DICT IN ME JS: ', userDict);
                        User.findByIdAndUpdate(req.user.id, { $set: { dictionary: userDict } }, { new: true })
                            .then(userWithDict => {
                                console.log('USERWITHDIC: ', userWithDict);
                                res.send(userWithDict);

                            })
                    })
            })
            .catch(next);
    })

    .get('/albums', (req, res, next) => {
        User.getAlbums(req.user.id)
            .then(albums => res.send(albums))
            .catch(next);
    })

    .get('/matches', (req, res, next) => {
        User.getMatches(req.user.id)
            .then(response => {
                res.send(response);
            })
            .catch(next);
    });

module.exports = router;