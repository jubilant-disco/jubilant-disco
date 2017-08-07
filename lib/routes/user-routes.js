const express = require('express');
const router = express.Router();
const User = require('../models/user');

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
        let user = new User(req.body);
        console.log(user);

    })
    .post('/signin', hasRequiredFields, (req, res, next) =>{
        const userId = req.body._id;
        // User.findById({})
        // .then(user =>{

        // })
    })

    module.exports = router;