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
    password: requiredString,
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

schema.methods.setPassword = function(pw) {
    this.password = bcrypt.hashSync(pw, 8);
};

schema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

schema.static('exists', function(query) {
    return this.find(query)
        .count()
        .then(count => count > 0);
});

module.exports = mongoose.model('User', schema);