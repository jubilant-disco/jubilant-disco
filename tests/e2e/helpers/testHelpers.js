const request = require('./request');


module.exports = {
    saveUser(user) {
        return request.post('/auth/signup')
            .send(user)
            .then(res => {
                console.log('TEST HELPERS RES BODY', res.body);
                user.token = res.body.token;
                return user;
            });
    }
};