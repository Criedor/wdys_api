var express = require('express');
var path = require('path');
const port = process.env.PORT || 3000
const cors = require('cors')
require('dotenv').config()
require('./database/client')

var apiRouter = require('./routes/index');
var app = express();

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', apiRouter);


app.listen(port, () =>
console.log('server is running on port: ' +port))


module.exports = app;