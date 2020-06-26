var path = require('path');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Users = require('../database/models/users');
const saltRounds = 10;
require('dotenv').config()
require('../database/client')


exports.login = (req,res) => {
    Users.findOne({email:`${req.body.email.trim()}`, })
    .exec( (err, user) => {
        if(user && !err) {
            let pw=req.body.password
            let hash=user.password
            bcrypt.compare(pw, hash, (err, result)=>{
            if (err || !result) {return res.send({"errorcode": "1"})}  //errorcode 1= wrong password
                else { 
                    const token = jwt.sign({ 'name': req.body.name }, process.env.SECRET)
                    return res.set('x-token', token).send({token:`${token}`, user_id: `${user._id}`, displayname: `${user.displayname}`, role: `${user.role}` })
                    }
                })
        } else { return res.send({"errorcode": "2"})}  //errorcode 2= wrong email
    })
};  


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