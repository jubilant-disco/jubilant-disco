const request = require('./request');


module.exports = {
    saveUser(user) {
        return request.post('/users/signup')
            .send(user)
            .then(res => token = res.body.token);
    }
};