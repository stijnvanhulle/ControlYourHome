var express = require('express');
var fs      = require('fs');
var path    = require("path");
var app     = express();
var router  = express.Router();
var access      = require('../controllers/authController').access;
var isAdmin      = require('../controllers/authController').isAdmin;

router.get('/index',access, function (req, res) {

    fs.exists(path.join(__dirname, '../', 'views/main/index') + '.jade', function (exists) {
        if(exists){
            res.render('main/index' );
        }else{
            res.render('template/error', {
                message: "Can't load",
                error: {}
            });
        }
    })

});

router.get('/login', function (req, res) {

    fs.exists(path.join(__dirname, '../', 'views/login/index') + '.jade', function (exists) {
        if(exists){
            res.render('login/index' );
        }else{
            res.render('template/error', {
                message: "Can't load",
                error: {}
            });
        }
    });


});
router.get('/plan',access, function (req, res) {

    fs.exists(path.join(__dirname, '../', 'views/plan/index') + '.jade', function (exists) {
        if(exists){
            res.render('plan/index' );
        }else{
            res.render('template/error', {
                message: "Can't load",
                error: {}
            });
        }
    });


});
router.get('/filter',access,isAdmin, function (req, res) {

    fs.exists(path.join(__dirname, '../', 'views/filter/index') + '.jade', function (exists) {
        if(exists){
            res.render('filter/index' );
        }else{
            res.render('template/error', {
                message: "Can't load",
                error: {}
            });
        }
    });


});
router.get('/access',access,isAdmin, function (req, res) {

    fs.exists(path.join(__dirname, '../', 'views/access/index') + '.jade', function (exists) {
        if(exists){
            res.render('access/index' );
        }else{
            res.render('template/error', {
                message: "Can't load",
                error: {}
            });
        }
    });


});
router.get('/schedule',access,isAdmin,  function (req, res) {

    fs.exists(path.join(__dirname, '../', 'views/schedule/index') + '.jade', function (exists) {
        if(exists){
            res.render('schedule/index' );
        }else{
            res.render('template/error', {
                message: "Can't load",
                error: {}
            });
        }
    });


});


router.get('/live',access, function (req, res) {

    fs.exists(path.join(__dirname, '../', 'views/live/index') + '.jade', function (exists) {
        if(exists){
            res.render('live/index' );
        }else{
            res.render('template/error', {
                message: "Can't load",
                error: {}
            });
        }
    });


});

router.get('/photo',access, function (req, res) {

    fs.exists(path.join(__dirname, '../', 'views/photo/index') + '.jade', function (exists) {
        if(exists){
            res.render('photo/index' );
        }else{
            res.render('template/error', {
                message: "Can't load",
                error: {}
            });
        }
    });


});

module.exports = router;
