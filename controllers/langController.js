var path = require('path');
const Langs = require('../database/models/langs');
require('dotenv').config()
require('../database/client')


exports.languages = (req, res) => {
    Langs.find({})
    .exec( (err, langs) => {
        if(langs && !err) {
            res.status(200).send({"languages": langs})
        } 
        else { 
            return res.send({"errorcode": "No languages found"})
        }
    });   
}


exports.lang = (req,res) => {
    var lang =  new Langs ({lang: `${req.body.lang}`, langname: `${req.body.langname}`})
        lang.save( (err) => {
            if (err) res.send({"errorcode":"Cant save language"})
            else res.send("Language created") 
        })
    };  
