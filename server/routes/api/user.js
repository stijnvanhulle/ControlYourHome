var express         = require('express');
var app             = express();
var router          = express.Router();
var bodyParser      = require('body-parser');
var jsonParser      = bodyParser.json({ type: 'application/json' } );
var controller      = require('../../controllers/userController');
var access          = require('../../controllers/authController').access;

router.get('/', access, jsonParser, controller.getUsers);
router.get('/types', access, jsonParser, controller.getUserTypes);

router.put('/', access, jsonParser, controller.putUser);

router.post('/remove', access, jsonParser, controller.removeUser);

router.post('/', access, jsonParser, controller.postUser);

module.exports = router;
