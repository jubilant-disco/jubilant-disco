const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seedAlbumSchema = new Schema({
    title: { type: String },
    artist: { type: String },
    genre: { type: String },
    discogsMasterId: { type: Number },
    discogsMasterUrl: { type: String }
});

module.exports = mongoose.model('seedAlbum', seedAlbumSchema);