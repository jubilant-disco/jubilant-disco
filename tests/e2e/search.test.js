//const db = require('./db');
require('dotenv').config();
const request = require('../helpers/request');
const assert = require('chai').assert;


describe('search route', () => {

    const artist = 'Nirvana';
    const title = 'Nevermind';

    it('searches an album', () => {
        return request.get(`/search/artist=${artist}&release_title=${title}`)
            .then(res => res.body)
            .then(data => {
                assert.equal(data.genre, 'Rock');
                assert.equal(data.artist, artist);
                assert.equal(data.title, title);
            });
    });

    it('returns empty if artist or title does not exist', () => {
        return request.get(`/search/artist=${artist}&release_title=lalala`)
            .then(res => res.body)
            .then(data => {
                assert.equal(data.results, 0);
            });
    });



});