var express         = require('express');
var app             = express();
var router          = express.Router();
var bodyParser      = require('body-parser');
var jsonParser      = bodyParser.json({ type: 'application/json' } );
var controller      = require('../../controllers/authController');


router.get('/',jsonParser, controller.getUser);
router.post('/local',jsonParser, controller.local);

router.post('/logoff', controller.logoff);
module.exports = router;