var path = require('path')
require('dotenv').config()
require('../database/client')


exports.test = (req,res) => {
    return res.send("This is a test");
} ;
