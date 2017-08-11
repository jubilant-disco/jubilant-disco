/* eslint no-console: "off" */
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const dbUri = process.env.MONGODB_URI;

mongoose.connect(dbUri);

mongoose.connection.on('connected', function () {
    console.log('mongoose default connection open to ' + dbUri);
});

mongoose.connection.on('error', function(err) {
    console.log('mongoose default connection error' + err);
});

mongoose.connection.on('disconnected', function () {
    mongoose.connection.close(function () {
        console.log('mongoose default connection disconnected through app termination');
        console.log('PROCESS SHUTTING DOWN.');
        process.exit(1);
    });
});