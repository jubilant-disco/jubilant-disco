const Router = require('express').Router;
const router = Router();
const User = require('../models/user');

router
    .get('/', (req, res, next) => {
        return User.find()
            .lean()
            //.select(actual fields you should return, NOT hash)
            .then(results => res.send(results))
            .catch(next);
    });

module.exports = router;