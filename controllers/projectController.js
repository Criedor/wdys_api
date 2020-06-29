var path = require('path');
const Projects = require('../database/models/projects');
const Langs = require('../database/models/langs');
const Pages = require('../database/models/pages');
const pages = require('../database/models/pages');


require('dotenv').config()
require('../database/client')


exports.initial = (req,res) => {
    Projects.find({owner_id: `${req.params.user_id}`})
    .exec( (err, projects) => {
        if(projects && !err) {
             Langs.find({})
                .exec( (err, langs) => {
                    if(langs && !err) {
                        res.status(200).send({"languages": langs, "userprojects": projects})} 
                    else { return res.send({"errorcode": "No languages found"})}
                });
        } 
        else { return res.send({"errorcode": "No projects found."})}
     });
};  


exports.create = (req,res) => {
    var project =  new Projects (
        {
            projectname: `${req.body.projectname}`, 
            owner_id: `${req.body.owner_id}`, 
            langs: req.body.langs, 
            baselang: `${req.body.baselang}`,
            deadline: `${req.body.deadline}`
        })
        
    project.save((err)=>{
        if (err) { return res.send({'errorcode': 'Project creation failed'})}
        else { return (res.status(201).send(project))
        }
    });
}


exports.delete = (req,res) => {
    Projects.findOneAndDelete({_id: req.body.project_id, owner_id: req.body.owner_id})
    .exec((err, project)=>{
        if (!err && project) {
            Pages.deleteMany({base_project_id: project._id})
            .exec((err, pages)=>{
                if (!err && project) {
                    res.status(200).send("Project and related pages successfully deleted")
                }
            })
        }
        else res.send("An error occurred finding your project")
    })
}


exports.showProjectById = (req,res) => {
    Projects.findOne({_id: `${req.params.project_id}`, owner_id: `${req.params.user_id}`})
    .exec( (err, project) => {
        if(project && !err) {
            Pages.find({base_project_id: `${req.params.project_id}`, base_page_id: "base"})
                .exec( (err, pages) => {
                    if(pages && !err) {
                        res.status(200).send({"project": project, "pages": pages })} 
                    else { return res.send({"errorcode": "Could not load requested project", "project_id":`${req.params.project_id}`})}
                });
        } 
        else { return res.send({"errorcode": "No projects found."})}
     });
};  


exports.updateProject = (req,res) => {
    let lang_array = req.body.langs
    Projects.findOneAndUpdate(
        {
            _id: `${req.params.project_id}`, 
            owner_id: `${req.body.owner_id}`
        },
        {
            projectname: `${req.body.projectname}`, 
            deadline: `${req.body.deadline}`, 
            langs: req.body.langs
        } 
    )
    .exec((err, projects) => {
        if(projects && !err) {
            Pages.findOne({base_project_id: projects._id, base_page_id: "base"})                                         //get basepage
                .exec( (err, basepage) => {
                    console.log(basepage)
                    if(!err) {
                            if(basepage !== null){
                            let newLang = req.body.langs.filter(lang => !projects.langs.includes(lang))
                                newLang.map(x=>{
                                    console.log("Map Lang "+x)
                                    var page =  new Pages (
                                        {
                                            pagename: `${basepage.pagename}- ${x}`, 
                                            page_url: `${basepage.page_url}`, 
                                            base_lang: `${basepage.base_lang}`,
                                            base_project_id: `${basepage.base_project_id}`,
                                            lang: `${x}`,
                                            innerHTML: `${basepage.innerHTML}`
                                        })
                                    page.save((err)=>{
                                        if (err) {console.log(err); return res.send({'errorcode': 'Page creation failed'})}
                                        console.log("New translation page for "+x+" created.")
                                    });
                                })
                            return res.status(200).send('Project sucessfully updated.')
                            }
              "project updated"
                        return res.status(200).send('Project sucessfully updated and new translationpages created.')
                        }
                    else {return res.send({"errorcode": "Could not load requested basepage"})
                    }
                });
        }
        else {
            return res.send({"errorcode": "Project update failed"})
        }
    })
} 




exports.projects_extension_initial = (req,res) => {
    Projects.find({owner_id: `${req.params.user_id}`})
    .exec( (err, projects) => {
        if(projects && !err) {
            let base_ids = []
            projects.map(x=> base_ids.push(x._id))
            Pages.find({base_project_id: { $in: base_ids }})
                .exec( (err, pages) => {
                    if(pages && !err) {
                        res.status(200).send({"projects": projects, "basepages": pages})} 
                    else { return res.send({"errorcode": "No related pages found"})}
                });
        } 
        else { return res.send({"errorcode": "No projects found."})}
     });
};  


