var path = require('path');
const Pages = require('../database/models/pages');
const { userInfo } = require('os');
const Users = require('../database/models/users');
const moment = require('moment');

require('dotenv').config()
require('../database/client')


exports.snapshot = (req,res) => {
    var page =  new Pages (
        {
            pagename: `${req.body.pagename}`, 
            description: `${req.body.description}`, 
            page_url: `${req.body.page_url}`, 
            base_lang: `${req.body.base_lang}`,
            base_project_id: `${req.params.project_id}`,
            innerHTML: `${req.body.innerHTML}`,
            lang: `${req.body.base_lang}`
        })
    page.save((err)=>{
        if (err) {console.log(err); return res.send({'errorcode': 'Page creation failed'})}
        else { return (res.send("Page successfully created."))
        }
    });
}


exports.showBasePage = (req,res) => {
    Pages.findOne({base_project_id: req.params.project_id, base_page_id: "base"})            //get basepage
    .exec( (err, basepage) => {
        if(basepage && !err) {
            Pages.find({base_page_id: basepage._id})                                    //get translationpages
                .exec( (err, pages) => {
                if(pages && !err) {
                    let translator_langs = [basepage.base_lang]
                    pages.map(p=> translator_langs.push(p.lang))
                    console.log(translator_langs)
                    Users.find({role: 1, userreference: req.body.user_id, translator_langs:{ $in: translator_langs}})       //get all translator with the related langs
                    .exec( (err, translators) => {
                        if(translators && !err) {
                            res.status(200).send({"translationpage": pages, "basepage": basepage, "translators": translators})
                        } 
                        else {
                            return res.send({"errorcode": "Could not load requested translators"})
                        }
                    })
                }
                else {return res.send({"errorcode": "Could not load requested translationpages"})}
                });
            }
        else {return res.send({"errorcode": "Could not load requested basepage"})}
    })
} 


exports.assignTranslator = (req,res) => {
    Pages.findOneAndUpdate({_id: req.body.page_id}, {translator_id: req.body.translator_id, assigned: new Date(), status: "open"})
    .exec( (err, page) => {
        if(page && !err) {
            res.send("Page assigned.")} 
        else {
            return res.send({"errorcode": "Could not assign translator"})
        }
    });
}