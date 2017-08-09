const Router = require('express').Router;
const router = Router();
const superAgent = require('superagent');

router
    .get('/:query', (req, res, next) => {
        superAgent
            .get(`https://api.discogs.com/database/search?type=master&${req.params.query}&token=${process.env.DISCOGS_TOKEN}`)
            .then(results => {
                if (JSON.parse(results.text).pagination.items === 0) res.send({ results: 0 });
                else {
                    const titleArr = JSON.parse(results.text).results[0].title.split(' - ');
                    const foundAlbum = {
                        id: JSON.parse(results.text).results[0].id,
                        title: titleArr[1],
                        artist: titleArr[0],
                        genre: JSON.parse(results.text).results[0].genre[0]
                    };
                    res.send(foundAlbum);
                }

            })
            .catch(next);
    });

module.exports = router;