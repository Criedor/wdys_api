var express = require('express');
var router = express.Router();
var cors = require('cors');
const apiController = require('../controllers/controller')


router.get('/', apiController.test);


module.exports = router;