const Router = require('express').Router;
const router = Router();
const superAgent = require('superagent');

router
    .get('/:query', (req, res, next) => {
        superAgent
            .get(`https://api.discogs.com/database/search?q=${req.params.query}&token=${process.env.DISCOGS_TOKEN}`)
            .then(results => res.send(results))
            .catch(next);
    });

module.exports = router;