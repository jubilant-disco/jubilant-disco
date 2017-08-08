require('dotenv').config();
const appSecret = process.env.APP_SECRET;
const jwt = require('jsonwebtoken-promisified');

module.exports = {
    sign(user) {

        const payload = { id: user._id};
        console.log('Payload:', payload);
        console.log('AppSecret:', appSecret);
        return jwt.signAsync(payload, appSecret);
    },
    verify(token) {
        return jwt.verifyAsync(token, appSecret);
    }

};