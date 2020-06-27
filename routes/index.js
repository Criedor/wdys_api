var express = require('express');
var router = express.Router();
var cors = require('cors');
const langController = require('../controllers/langController')
const sessionController = require('../controllers/sessionController')
const projectController = require('../controllers/projectController')
const pageController = require('../controllers/pageController')
const translatorController = require('../controllers/translatorController')


router.post('/', langController.lang);
router.get('/', sessionController.null);
router.post('/login', sessionController.login); // Webversion login
router.post('/signup', sessionController.signup); //Webversion signup
router.post('/initial', projectController.initial) //initial data set onload of the web dashboard
router.post('/projects/create', projectController.create) //creates a new project for a user
router.post('/projects/delete', projectController.delete) //deletes a project and all connected pages.
router.post('/projects/:project_id', projectController.showProjectById) // shows a specific project of a user
router.post('/projects/:project_id/update', projectController.updateProject) // Applies changes to a specific project of a user (projectname, deadline, langs)
router.post('/projects/:project_id/snapshot', pageController.snapshot) // Extension creates a page snapshot, only available for a translation manager
router.post('/projects/:project_id/base', pageController.showBasePage) // Shows the basepage, the translation pages and translators (are setup for project languges) for a specific project
router.post('/projects/:project_id/base/assign', pageController.assignTranslator) //Assigns a translator to a translation page
router.post('/projects/extensions/initial', projectController.projects_extension_initial) //On initial load of the extension by a TM he gets all his projects and the related base pages
router.post('/translators/extension/initial', translatorController.translator_extension_initial) //on initial load of the extension by a TR he gets all his translation pages and the related projects
router.post('/translators/extension/getage', translatorController.getpage) // loads a snapshot of a specific page for translator and also send basepage innerHTML
router.post('/translators/extension/sendpage', translatorController.sendpage) // saves a snapshot of a specific page a translator worked on
router.post('/translators/', translatorController.translators_inital) // loads all translators added the by logged in TM


module.exports = router;