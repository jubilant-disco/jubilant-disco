const tokenService = require('./token-service');

module.exports = function getEnsureAuth() {

    return function ensureAuth(req, res, next) {
        const token = req.get('Authorization');
        if(!token) {
            return next({code: 401, error: 'No Authorization found'});
        }
        tokenService.verify(token)
            .then(payload => {
                req.user = payload;
                next();
            })
            .catch(() => {
                next({code: 401, error: 'Authorization failed'});
            });
    };
};