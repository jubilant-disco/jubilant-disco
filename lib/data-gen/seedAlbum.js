const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seedAlbumSchema = new Schema({

    albumId: Number,
    artist: {
        type: String,
        required: true
    },
    album: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    rank: {
        type: Number,
        min: 1,
        max: 10
    }

});

module.exports = mongoose.model('seedAlbum', seedAlbumSchema);