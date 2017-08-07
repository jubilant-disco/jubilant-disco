const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requiredString = {
    name: String,
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
        rank: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        }
    }],
    favUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('User', schema);