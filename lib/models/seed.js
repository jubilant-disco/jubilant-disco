const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seedAlbumSchema = new Schema({
    title: { type: String },
    artist: { type: String },
    genre: { type: String },
    discogsMasterId: { type: Number },
    discogsMasterUrl: { type: String }
});

const seedUserSchema = new Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    favAlbums: [{
        seedAlbum: seedAlbumSchema,
        rank: {
            type: Number,
            required: true,
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
        ref: 'seedUser'
    }],
    topFiveMatches: [{
        type: Schema.Types.ObjectId,
        ref: 'seedUser'
    }]
});


module.exports = (
    mongoose.model('seedAlbum', seedAlbumSchema)
)