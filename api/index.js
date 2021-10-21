const express = require('express');
const db = require('./dbConf');
// express instance
const app = express();
// init inbuilt bodyparser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// require api routes
const users = require('./routes/users');

// use routes
app.use(users);

module.exports = {
    path: '/api',
    handler: app
}