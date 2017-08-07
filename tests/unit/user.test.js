const User = require('../../lib/models/user');
const { assert } = require('chai');

describe('user API', () => {
    it('validates the user', () => {
        const user = new User({
            name: 'Andrew',
            email: 'andrew@andrew.com',
            hash: 'blhahasd',
            favAlbums: [{
                title: 'Kenny Loggins Greatest Hits',
                artist: 'Kenny Loggin',
                genre: 'Rock',
                rank: 2
            }]
        });
        return user.validate();
    });
});