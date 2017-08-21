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

const makeMyDict = (myDict) => {
    const { genre, artist, albumId } = myDict.dictionary[0];
    return {
        genre: genre[0],
        artist: artist[0],
        albumId: albumId[0],
    };
};
const makeOtherDict = ([dict]) => dict;

schema.static('calculateMatches', function(dictionaries, myId) {
    return this.findById(myId)
        .select('dictionary')
        .then(myDict => {
            
            const my = makeMyDict(myDict);
            const other = makeOtherDict(dictionaries);
            const scores = {};

            function updateScore(type, calc) { // eslint-disable-line
                const mine = my[type];
                const theirs = other[type];
                for (const [myKey, myValue] of Object.entries(mine)) {
                    for (const { _id, [type]: type } of theirs) {
                        scores[_id] = scores[_id] || 0;
                        const otherValue = type[myKey];
                        if (otherValue) {
                            scores[_id] += calc(myValue, otherValue);
                        }
                    }
                }
            }

            updateScore('genre', (mine, theirs) => Math.min(mine, theirs) * 2);
            updateScore('artist', (mine, theirs) => ((11 - mine) + (11 - theirs)) / 2);
            updateScore('albumId', (mine, theirs) => (11 - mine) + (11 - theirs));

            const idArray = Object.keys(scores).map(mongoose.Types.ObjectId);

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