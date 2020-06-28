var path = require('path');
const Pages = require('../database/models/pages');
const { userInfo } = require('os');
const Users = require('../database/models/users');
const moment = require('moment');
const { base } = require('../database/models/users');

require('dotenv').config()
require('../database/client')

exports.translators_inital = (req,res) => {
    Users.find({role: 1, userreference: req.body.user_id})
    .exec( (err, translators) => {
        if(translators && !err) {
            res.send(translators)} 
        else {
            return res.send({"errorcode": "Could load translators"})
        }
    });
}

exports.translator_extension_initial = (req,res) => {
    Pages.find({translator_id: `${req.body.translator_id}`})
    .exec( (err, pages) => {
        if(pages && !err) {
            let base_projects_ids = []
            pages.map(x=> base_projects_ids.push(x.base_project_id))
            Projects.find({_id: { $in: base_projects_ids }})
                .exec( (err, projects) => {
                    if(projects && !err) {
                        res.status(200).send({"projects": projects, "translationpages": pages})} 
                    else { return res.send({"errorcode": "No related pages found"})}
                });
        } 
        else { return res.send({"errorcode": "No projects found."})}
     });
};  


exports.getpage = (req,res) => {
    Pages.findOne({pagename: req.body.pagename, translator_id: req.body.translator_id})     //get translation page
    .exec( (err, page) => {
        if(page && !err) {
            Pages.findOne({_id: page.base_page_id})                                         //get basepage
                .exec( (err, basepage) => {
                if(basepage && !err) {
                res.send({"translationpage": page, "basepage": basepage})} 
                else {return res.send({"errorcode": "Could not load requested basepage"})}
                });
            }
        else {return res.send({"errorcode": "Could not load requested page"})}
    })
} 


exports.sendpage = (req,res) => {
    Pages.findOneAndUpdate({pagename: req.body.pagename, translator_id: req.body.translator_id}, {innerHTML: req.body.innerHTML})
    .exec( (err, page) => {
        if(page && !err) {
            res.send("Page saved")} 
        else {return res.send({"errorcode": "Could not save page"})}
        });
}




//// EMAIL OR PASSWORD SETTING IS MISSING


// Checks if translator already exists. If so, add TM to userreference, update translator_langs. Else create a new translator.
exports.translator_create = (req,res) => {
    Users.findOne({email: req.body.email})
    .exec((err, existing_translator)=>{
        if (!existing_translator) {
            var new_translator =  new Users (
                {
                    email: req.body.email, 
                    role: 1, 
                    translator_langs: req.body.translator_langs, 
                    displayname: req.body.displayname,
                    userreference: req.body.user_id
                })
                
            new_translator.save((err)=>{
                if (err) { return res.send({'errorcode': 'Translator creation failed.'})}
                else { return (res.status(201).send("Translator created."))
                }
            });
        }
        else {
            // Check if lang is in translators set, else add it.
            let new_translator_lang = req.body.translator_langs.filter(x => !existing_translator.translator_langs.includes(x));
            Users.findOneAndUpdate({_id: existing_translator._id},{$push: {userreference: req.body.user_id, translator_langs: new_translator_lang}})
            .exec((err)=>{
                if(err) res.status(400).send("Could not update existing translator.")
                else res.status(200).send({"displayname": existing_translator.displayname, "other_translator_langs": existing_translator.translator_langs.filter(y=>!req.body.translator_langs.includes(y))})
            })
        }
    })
}


exports.translator_remove = (req,res) => {
    Users.findOneAndUpdate({_id: req.body.translator_id, userreference: req.body.user_id}, {$pull: {userreference: req.body.user_id}})
    .exec( (err, user) => {
        if(user && !err) {
            res.send("Translator removed.")} 
        else {return res.send({"errorcode": "Could not remove Translator"})}
        }
    );
}


exports.translation_compare = (req,res) => {
    Pages.findOne({_id: req.params.page_id})
    .exec((err, page) => {
        if(err || !page) {
            res.status(400).send({'errorcode': 'Could not load requested page.'})
        }
        else {
            Pages.findOne({_id: page.base_page_id})
            .exec((err, basepage) => {
                if(err || !page) {
                    res.status(400).send({'errorcode': 'Could not load requested basepage.'})
                }
                else {
                    res.status(200).send({'page': page, 'basepage':basepage})
                }
            })
        }
    })
}


exports.translatorsById = (req,res) => {
    Users.findOne({role: 1, userreference: req.body.user_id, _id: req.params.user_id})
    .exec( (err, translator) => {
        if(translators && !err) {
            Pages.find({translator_id: req.params.user_id})
            .exec((err, pages)=>{
                if(pages, !err) {
                    res.status(200).send({'translator': translator, 'assignedPages': pages})
                }
                else {
                    res.status(400).send({'errorcode':'Could not load assigned pages.'})
                }
            })   
        } 
        else {
            return res.send({"errorcode": "Could load translators"})
        }
    });
}