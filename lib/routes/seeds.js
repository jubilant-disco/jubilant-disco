const Router = require('express')
    .Router;
const router = Router();
const superAgent = require('superagent');

router
    .get('/', (req, res, next) => {
        const { id } = req.body;
        if (id) {
            return superAgent
                .get(`https://api.discogs.com/masters/${id}`)
                .then(results => {
                    res.send(results.body);
                })
                .catch(next);
        }
        // what about the else!?!?
    });

module.exports = router;