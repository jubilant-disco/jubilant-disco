const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seedAlbumSchema = new Schema({
    album: { type: String },
    artist: { type: String },
    genre: { type: String },
    albumId: { type: Number }
});

module.exports = mongoose.model('seedAlbum', seedAlbumSchema);