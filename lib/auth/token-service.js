require('dotenv').config();
const appSecret = process.env.APP_SECRET;
const jwt = require('jsonwebtoken-promisified');

module.exports = {
    sign(user) {
        console.log(user);
        const payload = { id: user._id
                };
        return jwt.signAsync({
                id: payload.id            },
            appSecret,
            '7d'
        );
    },
    verify(req, res, next) {
        return jwt.verifyAsync(token);
    }

};