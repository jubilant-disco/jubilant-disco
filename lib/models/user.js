const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const requiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    name: requiredString,
    email: requiredString,
    hash: requiredString,
    favAlbums: [{
        title: requiredString,
        artist: requiredString,
        genre: requiredString,
        albumId: Number,
        rank: {
            type: Number,
            min: 1,
            max: 10
        }
    }],
    albumDict: {

    },
    genreDict: {

    },
    artistDict: {

    },
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
        .then(count => count > 0);
});

module.exports = mongoose.model('User', schema);