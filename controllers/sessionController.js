var path = require('path');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Users = require('../database/models/users');
const Langs = require('../database/models/langs');
const saltRounds = 10;
require('dotenv').config()
require('../database/client')


exports.null = (req,res) => {
    res.status(415).send(`<img src="https://i.imgflip.com/46jc51.jpg" alt="api" />`)
};  


exports.login = (req,res) => {
    Users.findOne({email:`${req.body.email.trim()}`, })
    .exec( (err, user) => {
        if(user && !err) {
            let pw=req.body.password
            let hash=user.password
            bcrypt.compare(pw, hash, (err, result)=>{
            if (err || !result) {return res.send({"errorcode": "1"})}  //errorcode 1= wrong password
                else { 
                    const token = jwt.sign({ 'token': req.body.password }, process.env.SECRET)
                    return res.set('x-token', token).send({token:`${token}`, user_id: `${user._id}`, displayname: `${user.displayname}`, role: `${user.role}` })
                    }
                })
        } else { return res.send({"errorcode": "2"})}  //errorcode 2= wrong email
    })
};  


exports.tokenverify = (req,res) => {
    console.log(req.body)
    let pw = jwt.verify(req.body.token, process.env.SECRET);

    Users.findOne({_id:`${req.body.user_id}`, })
    .exec( (err, user) => {
        if(user && !err) {

            return res.status(200).send({token:`${req.body.token}`, user_id: `${user._id}`, displayname: `${user.displayname}`, role: `${user.role}` })
            }   
        else {
            return res.status(500).send({"err": "Invalid token"})
            }
        }
    )
}


exports.signup = (req,res) => {
    let pw = req.body.password
    let pwhash
    bcrypt.genSalt(saltRounds, function(err, salt) { 
        bcrypt.hash(pw, salt, (err, hash)=>{
            if (err || !res) 
                {res.status(400).send({'bcrypt error': err})}
            else { 
                var user =  new Users ({displayname: `${req.body.displayname}`, password: `${hash}`, email: `${req.body.email}`})
                user.save((err)=>{
                if (err) { return res.set('x-errcode', 2).send({'errorcode': '2'})}
                else {
                    const token = jwt.sign({ 'name': req.body.name }, process.env.SECRET)
                    return (res.set('x-token', token).send({token:`${token}`, displayname:`${req.body.displayname}`, user_id: user._id, role: user.role}))
                }});
            }
        });
    })
};