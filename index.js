// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 4444;
require('dotenv').config();
const cors = require('cors');
// load express
const path = require('path');
const express = require('express');
const InitiateMongoServer = require('./configs/database');
const bodyparser = require('body-parser');
var app = express();
// start mongodb server
InitiateMongoServer();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
// middleware to add username in session and for flash messages
app.use((req, res, next) => {
	res.locals.user = req.user || null;
	next();
});
// use routes
app.use('/admin', require('./routes/admin'));
app.use('/user', require('./routes/user'));
app.use('/dish', require('./routes/dish'))
app.listen(port, () => {
	console.log(`Server up on port ${port}`);
});
