before(() => {
    const db = require('./helpers/db');
    db.drop('users');

console.log('before');

    const tokenJoe = {
        email: 'joe@jubilant-disco.com',
        password: 'abc',
        name: 'Jubilant Discoer'
    }
    let joeToken = '';
    db.getToken(tokenJoe).then(t => joeToken = t);

});