const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');
const app = express();
		
// body-parser is a npm module which allow to parse the body of the request
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/MSRTest').then(() => {
	console.log('connected to databse successfully');
}).catch(() => {
	console.log('connected to databse failed');
});


// cross origin
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Authorization, Content-Type, Accept');
	res.setHeader('Access-Control-Allow-Methods',"GET, POST, PATCH,PUT, DELETE, OPTIONS");
	next();
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/books', bookRoutes);

//to export the express js app
module.exports = app;






