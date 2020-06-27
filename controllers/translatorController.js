var path = require('path');
const Pages = require('../database/models/pages');
const { userInfo } = require('os');
const Users = require('../database/models/users');
const moment = require('moment');

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
            console.log(base_projects_ids)
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