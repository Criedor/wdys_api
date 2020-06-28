var path = require('path');
const langs = require('../database/models/langs');
require('dotenv').config()
require('../database/client')


exports.lang = (req,res) => {
    var lang =  new langs ({lang: `${req.body.lang}`, langname: `${req.body.langname}`})
        lang.save( (err) => {
            if (err) res.send({"errorcode":"Cant save language"})
            else res.send("Language created") 
        })
    };  
