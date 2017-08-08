require('dotenv').config();
const appSecret = process.env.APP_SECRET;
const jwt = require('jsonwebtoken-promisified');

module.exports = {
    sign(user) {
        const payload = { id: user._id
                };
        return jwt.signAsync({
                id: payload.id            },
            appSecret,
            '7d'
        );
    },
    verify(token) {
        return jwt.verifyAsync(token);
    }

};