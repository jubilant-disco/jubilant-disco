const request = require('./request');


module.exports = {
    saveUser(user) {
        return request.post('/auth/signup')
            .send(user)
            .then(res => {
                return res.body;
            })
    }
};