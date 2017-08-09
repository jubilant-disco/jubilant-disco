const Router = require('express').Router;
const router = Router();
const User = require('../models/user');
const tokenService = require('../auth/token-service');
const ensureAuth = require('../auth/ensure-auth')();


function hasRequiredFields(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        return next({
            code: 400,
            error: 'Both email and password are required.'
        });
    }
    next();
}

router 
    .get('/verify', ensureAuth, (req, res) => {
        res.send({ valid: true });
    })

    .post('/signup', hasRequiredFields, (req, res, next) => {
        console.log('what is req.body', req.body);
        const { name, email, password } = req.body;
        delete req.body.password;

        User.exists({ email })
            .then(exists => {
                if (exists) {
                    throw next({
                        code: 400,
                        error: 'email in use'
                    });
                }
                const user = new User({ name, email });
                console.log('USER IS', user);
                user.generateHash(password);
                return user.save();
            })
            .then(user => tokenService.sign(user))
            .then(token => res.send({ token }))
            .catch(next);
    })

    .post('/signin', hasRequiredFields, (req, res, next) => {
        const { name, email, password } = req.body;
        let userObj = {};
        delete req.body.password;
        
        User.findOne({ email })
            .then(user => {
                if(!user || !user.comparePassword(password)) {
                    throw next({
                        code: 401,
                        error: 'Invalid Login'
                    });
                }
                return user;
            })
            .then(user => {
                userObj.user = user;
                return tokenService.sign(user);
            })
            .then(token => {
                userObj.token = token;
                res.send({ userObj });
            })
            .catch(next);
    });

module.exports = router;