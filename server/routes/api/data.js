var express         = require('express');
var app             = express();
var router          = express.Router();
var bodyParser      = require('body-parser');
var jsonParser      = bodyParser.json({ type: 'application/json' } );
var controller      = require('../../controllers/dataController');
var access          = require('../../controllers/authController').access;

router.post('/', access, jsonParser, controller.postData);

router.post('/find', access, jsonParser, controller.getData);

module.exports = router;
