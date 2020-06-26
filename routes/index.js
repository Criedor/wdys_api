var express = require('express');
var router = express.Router();
var cors = require('cors');
const langController = require('../controllers/langController')
const sessionController = require('../controllers/sessionController')
const projectController = require('../controllers/projectController')
const pageController = require('../controllers/pageController')


router.post('/', langController.lang);

router.post('/login', sessionController.login); // Webversion login
router.post('/signup', sessionController.signup); //Webversion signup
router.post('/initial', projectController.initial) //initial data set onload of the web dashboard
router.post('/projects/create', projectController.create) //creates a new project for a user
router.post('/projects/:project_id', projectController.showProjectById) // shows a specific project of a user
router.post('/projects/:project_id/update', projectController.updateProject) // Applies changes to a specific project of a user (projectname, deadline, langs)
router.post('/projects/:project_id/snapshot', pageController.snapshot) // Extension creates a page snapshot, only available for a translation manager
router.post('/projects/extensions/initial', projectController.projects_initial) //On initial load of the extension by a TM he gets all his projects and the related base pages
router.post('/translators/extension/initial', projectController.translator_initial) //on initial load of the extension by a TR he gets all his translation pages and the related projects
router.post('/translators/extension/getpage', pageController.getpage) // loads a snapshot of a specific page for translator and also send basepage innerHTML
router.post('/translators/extension/sendpage', pageController.sendpage) // saves a snapshot of a specific page a translator worked on


module.exports = router;