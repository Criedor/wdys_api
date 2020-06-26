var express = require('express');
var path = require('path');
const port = process.env.PORT || 3000
const cors = require('cors')

require('dotenv').config()
require('./database/client')

var apiRouter = require('./routes/index');
var app = express();

app.use(cors())

app.use(express.json({limit: '2mb'}));
app.use(express.urlencoded({ extended: false }));
app.use('/', apiRouter);


app.listen(port,'0.0.0.0', () =>
console.log('server is running on port: ' +port))


module.exports = app;