const express = require('express');
const router = express.Router();
const User = require('../models/user');
const tokenService = require('../auth/token-service');

function hasRequiredFields(req, res, next) {
    const {
        email,
        password
    } = req.body;
    if (!email || !password) {
        return next({
            code: 400,
            error: 'Both email and password are required.'
        })
    }
    next();
}

router
    .post('/signup', hasRequiredFields, (req, res, next) => {
        const { email, password, name
        } = req.body;
        User.exists({
                email
            })
            .then(exists => {
                if (exists) {
                    throw next({
                        code: 400,
                        error: 'email in use'
                    });
                }
                const user = new User({
                    name: name,
                    email: email,
                    hash: password
                });

                user.setPassword(password);
                return user.save();
            })
            .then(user => tokenService.sign(user))
            .then(token => res.send({
                token
            }))
            .catch(next);
    })
    .post('/signin', hasRequiredFields, (req, res, next) => {
        const userId = req.body._id;
        // User.findById({})
        // .then(user =>{

        // })
    })

module.exports = router;