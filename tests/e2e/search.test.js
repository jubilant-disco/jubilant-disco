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
            .then(data => {
                let json = JSON.parse(data.text);
                let genre = json.results[0].genre[0];
                let titleArr = json.results[0].title.split(' - ');
                assert.equal(genre, 'Rock');
                assert.equal(titleArr[0], artist);
                assert.equal(titleArr[1], title);
            });
    });

});