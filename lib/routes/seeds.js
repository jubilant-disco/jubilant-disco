const Router = require('express')
    .Router;
const router = Router();
const superAgent = require('superagent');

router
    .get('/', (req, res, next) => {
            if (req.body.id) {
                return superAgent
                    .get(`https://api.discogs.com/masters/${req.body.id}`)
                    .then(results => {
                        res.send(results.body);
                    })
                    .catch(next);
            }
    });

module.exports = router;