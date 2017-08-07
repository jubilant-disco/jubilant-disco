//const db = require('./db');
require('dotenv').config();
const request = require('./_request');
const assert = require('chai').assert;

describe('search route', () => {

    const artist = 'Nirvana';
    const title = 'Nevermind';

    it('searches an album', () => {
        return request.get(`/search/artist=${artist}&release_title=${title}`)
            .then(res => res.body)
            .then(results => {
                console.log("RESULTS = ", JSON.parse(results.text));
                assert.ok(results);
            });
    });

});