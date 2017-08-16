const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const getDictionaries = require('./get-dictionaries');

const requiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    name: requiredString,
    email: requiredString,
    hash: requiredString,
    dictionary: [{
        albumId: { type: Array },
        genre: { type: Array },
        artist: { type: Array }
    }],
    favAlbums: [{
        albumId: Number,
        artist: requiredString,
        album: requiredString,
        genre: requiredString,
        rank: {
            type: Number,
            min: 1,
            max: 10
        }
    }],
    favUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

schema.methods.generateHash = function(password) {
    this.hash = bcrypt.hashSync(password);
};

schema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash);
};

schema.static('exists', function(query) {
    return this.find(query)
        .count()
        .then(count => (count > 0));
});

schema.static('getAlbums', function(id) {
    return this.findById(id)
        .lean()
        .select('favAlbums');
});

schema.static('getMyDictionary', function(userId, userAlbums) {
    const id = mongoose.Types.ObjectId(userId);
    const favAlbums = userAlbums;
    const queryVar = { $eq: id };
    return getDictionaries(queryVar, favAlbums);
});

schema.static('getDictionaries', function(userId) {
    const id = mongoose.Types.ObjectId(userId);
    return this.getAlbums(id)
        .then(({ favAlbums }) => {
            const queryVar = { $ne: userId };
            return getDictionaries(queryVar, favAlbums);
        });
});

schema.static('calculateMatches', function(dictionaries, myId) {
    return this.findById(myId)
        .select('dictionary')
        .then(myDict => {

            const myGenreDict = myDict.dictionary[0].genre[0].genre;
            const myArtistDict = myDict.dictionary[0].artist[0].artist;
            const myAlbumIdDict = myDict.dictionary[0].albumId[0].albumId;

            const otherGenreDicts = dictionaries[0].genre;
            const otherArtistDicts = dictionaries[0].artist;
            const otherAlbumIdDicts = dictionaries[0].albumId;
            const scores = {};

            for (const [myKey, myValue] of Object.entries(myGenreDict)) {
                for (const { _id, genre } of otherGenreDicts) {
                    scores[_id] = scores[_id] || 0;
                    const otherValue = genre[myKey];
                    if (otherValue) {
                        scores[_id] += Math.min(myValue, otherValue) * 2;
                    }
                }
            }
            for (const [myKey, myValue] of Object.entries(myArtistDict)) {
                for (const { _id, artist } of otherArtistDicts) {
                    scores[_id] = scores[_id] || 0;
                    const otherValue = artist[myKey];
                    if (otherValue) {
                        scores[_id] += ((11 - myValue) + (11 - otherValue)) / 2;


                    }
                }
            }
            for (const [myKey, myValue] of Object.entries(myAlbumIdDict)) {
                for (const { _id, albumId } of otherAlbumIdDicts) {
                    scores[_id] = scores[_id] || 0;
                    const otherValue = albumId[myKey];
                    if (otherValue) {
                        scores[_id] += (11 - myValue) + (11 - otherValue);

                    }
                }
            }

            const idArray = Object.keys(scores)
                .map(mongoose.Types.ObjectId);

            return this.find({ _id: { $in: idArray } })
                .lean()
                .select('name')
                .then(users => {
                    return users.map(user => {
                        return {
                            id: user._id,
                            name: user.name,
                            score: scores[user._id]
                        };
                    });
                })
                .then(scores => {
                    scores.sort(function(a, b) {
                        return b - a;
                    });
                    console.log(scores);

                    return scores;
                });
        });
});

module.exports = mongoose.model('User', schema);