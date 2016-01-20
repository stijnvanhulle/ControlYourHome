var express = require('express');
var app     = express();
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    res.render('main/main');
  }else{
    res.render('login/index');
  }

});

module.exports = router;
