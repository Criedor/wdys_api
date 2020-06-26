var path = require('path');
const Projects = require('../database/models/projects');
const Langs = require('../database/models/langs');
const Pages = require('../database/models/pages');


require('dotenv').config()
require('../database/client')


exports.initial = (req,res) => {
    Projects.find({owner_id: `${req.body.owner_id}`})
    .exec( (err, projects) => {
        if(projects && !err) {
             Langs.find({})
                .exec( (err, langs) => {
                    if(langs && !err) {
                        res.send({"languages": langs, "userprojects": projects})} 
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
            langs: `${req.body.langs}`, 
            baselang: `${req.body.baselang}`,
            deadline: `${req.body.deadline}`
        })
        
    project.save((err)=>{
        if (err) { return res.send({'errorcode': 'Project creation failed'})}
        else { return (res.send(project))
        }
    });
}

exports.showProjectById = (req,res) => {
    Projects.findOne({_id: `${req.params.project_id}`, owner_id: `${req.body.user_id}`})
    .exec( (err, project) => {
        if(project && !err) {
            Pages.find({base_project_id: `${req.params.project_id}`, base_page_id: "base"})
                .exec( (err, pages) => {
                    if(pages && !err) {
                        res.send({"project": project, "pages": pages })} 
                    else { return res.send({"errorcode": "Could not load requested project", "project_id":`${req.params.project_id}`})}
                });
        } 
        else { return res.send({"errorcode": "No projects found."})}
     });
};  

// STILL MISSING: Create new pages for added languages
exports.updateProject = (req,res) => {
    let newLangs
    //Find the original project and store the current .langs
    Projects.findOne({_id: `${req.params.project_id}`, owner_id: `${req.body.user_id}`})
        .exec( (err, projects) => {
            if(projects && !err) { 
                newLangs = req.body.langs.filter(lang => !projects.langs.includes(lang))
                }
            else {
                return res.send({"errorcode": "No projects found."})
            }
        
        //after storing added langs in newLangs update the project
        Projects.findOneAndUpdate(
            {
                _id: `${req.params.project_id}`, 
                owner_id: `${req.body.user_id}`
            },
            {
                projectname: `${req.body.projectname}`, 
                deadline: `${req.body.deadline}`, 
                $push: {langs: `${newLangs}`}
            } 
            )
            .exec((err, projects) => {
                if(projects && !err) {

                    //create pages for the new added langs 
                    return res.send("project updated")                        
                    } 
                else { 
                    return res.send({"errorcode": "Could not create new pages"}+err)
                    }
            })
        })
}

exports.projects_initial = (req,res) => {
    Projects.find({owner_id: `${req.body.owner_id}`})
    .exec( (err, projects) => {
        if(projects && !err) {
            let base_ids = []
            projects.map(x=> base_ids.push(x._id))
            Pages.find({base_project_id: { $in: base_ids }})
                .exec( (err, pages) => {
                    if(pages && !err) {
                        res.send({"projects": projects, "basepages": pages})} 
                    else { return res.send({"errorcode": "No related pages found"})}
                });
        } 
        else { return res.send({"errorcode": "No projects found."})}
     });
};  

exports.translator_initial = (req,res) => {
    Pages.find({translator_id: `${req.body.translator_id}`})
    .exec( (err, pages) => {
        if(pages && !err) {
            let base_projects_ids = []
            pages.map(x=> base_projects_ids.push(x.base_project_id))
            console.log(base_projects_ids)
            Projects.find({_id: { $in: base_projects_ids }})
                .exec( (err, projects) => {
                    if(projects && !err) {
                        res.send({"projects": projects, "translationpages": pages})} 
                    else { return res.send({"errorcode": "No related pages found"})}
                });
        } 
        else { return res.send({"errorcode": "No projects found."})}
     });
};  
