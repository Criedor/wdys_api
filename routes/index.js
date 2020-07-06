var express = require('express');
var router = express.Router();
const langController = require('../controllers/langController')
const sessionController = require('../controllers/sessionController')
const projectController = require('../controllers/projectController')
const pageController = require('../controllers/pageController')
const translatorController = require('../controllers/translatorController')


// router.post('/langs/create', langController.lang); //adds a language to the langs collection
router.get('/', sessionController.null);
router.put('/login', sessionController.login); // Webversion login
router.put('/verify', sessionController.tokenverify); // Webversion login
router.get('/languages', langController.languages); // Get languages
router.post('/signup', sessionController.signup); //Webversion signup
router.get('/initial/:user_id', projectController.initial) //initial data set onload of the web dashboard
router.post('/projects/create', projectController.create) //creates a new project for a user
router.delete('/projects/delete', projectController.delete) //deletes a project and all connected pages.
router.get('/projects/extensions/initial/:user_id', projectController.projects_extension_initial) //On initial load of the extension by a TM he gets all his projects and the related base pages
router.put('/projects/:project_id/update', projectController.updateProject) // Applies changes to a specific project of a user (projectname, deadline, langs)
router.post('/projects/:project_id/snapshot', pageController.snapshot) // Extension creates a page snapshot, only available for a translation manager
router.put('/projects/:project_id/assign', pageController.assignTranslator) //Assigns a translator to a translation page
router.get('/projects/:project_id/:user_id', projectController.showProjectById) // shows a specific project of a user
router.get('/projects/:project_id/:user_id/:base_page_id', pageController.showBasePage) // Shows the basepage, the translation pages and translators (are setup for project languges) for a specific project
router.put('/projects/:project_id/:user_id/:base_page_id/edit', pageController.editBasePage) // Updating name, and description of a basepage.
router.delete('/projects/:base_page_id/delete', pageController.deleteBasePage) // Deleting a basepage.
router.put('/translators/extension/sendpage', translatorController.sendpage) // saves a snapshot of a specific page a translator worked on
router.get('/translators/extension/:user_id/initial', translatorController.translator_extension_initial) //on initial load of the extension by a TR he gets all his translation pages and the related projects
router.get('/translators/extension/:user_id/:page_id', translatorController.getpage) // loads a snapshot of a specific page for translator and also send basepage innerHTML
router.post('/translators/create', translatorController.translator_create) // Checks if translator already exists. If so, add TM to userreference, update translator_langs. Else create a new translator
router.delete('/translators/remove', translatorController.translator_remove) // Removes a translator from the TM set of tr`s
router.get('/translators/:user_id/initial', translatorController.translators_inital) // loads all translators added the by the logged in TM
router.get('/translators/:user_id/:translator_id', translatorController.translatorsById) // get TR (check userreference) and all assigned pages
router.get('/translators/:user_id/pages/:page_id', translatorController.translation_compare) // load the innerHTML of a page and the related basepage.
router.get('/translation/:user_id', translatorController.translation_initial) //load all assigned pages and related projects
router.get('/translation/pages/:page_id', translatorController.translation_compare) //// load the innerHTML of a page and the related basepage


module.exports = router;