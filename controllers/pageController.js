var path = require('path');
const Pages = require('../database/models/pages');

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
        })
    page.save((err)=>{
        if (err) {console.log(err); return res.send({'errorcode': 'Page creation failed'})}
        else { return (res.send("Page successfully created."))
        }
    });
}


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

