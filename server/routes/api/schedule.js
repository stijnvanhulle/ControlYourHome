var express         = require('express');
var app             = express();
var router          = express.Router();
var bodyParser      = require('body-parser');
var jsonParser      = bodyParser.json({ type: 'application/json' } );
var controller      = require('../../controllers/scheduleController');
var access          = require('../../controllers/authController').access;

router.get('/', access, jsonParser, controller.getSchedules);

router.put('/', access, jsonParser, controller.putSchedule);

router.post('/', access, jsonParser, controller.postSchedule);

router.post('/remove', access, jsonParser, controller.removeSchedule);

module.exports = router;

