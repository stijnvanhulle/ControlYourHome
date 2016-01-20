var express         = require('express');
var app             = express();
var router          = express.Router();
var bodyParser      = require('body-parser');
var jsonParser      = bodyParser.json({ type: 'application/json', limit: '50mb'});
var controller      = require('../../controllers/photoController');
var access          = require('../../controllers/authController').access;

router.get('/', access, jsonParser, controller.getPhotos);
router.post('/', jsonParser, controller.postPhoto);

module.exports = router;
