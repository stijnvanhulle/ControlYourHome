/**
 * Created by stijnvanhulle on 26/11/15.
 */
var passport        = require('passport');
var pool            = require('../libs/mysql');




var local=function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        //console.log(err, info, user);
        //login db
        if (err)   { return res.json({ error: err.message, success: false }); }
        if (!user) { return res.json({error : "Invalid Login", success: false}); }
        req.login(user, {}, function(err) {
            if (err) { return res.json({error:err, success: false}); }
            return res.json(
                { user: req.user,
                    success: true
                });
        });
    })(req, res, next);
};

var logoff=function(req,res){
    req.logout();
    res.json({success: true});
};
var access=function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/404");
        //res.json({success:false, error:'Not authenticated'});
    }
};

var isAdmin=function(req,res,next){
    if(req.user.type.id==1){
        next();
    }else{
        res.redirect("/404");
        //res.json({success:false, error:'Not authenticated'});
    }

};

var getUser=function(req,res){
    if(req.isAuthenticated()){
        res.json(
            { user: req.user,
                success: true
            });
    }else{
        res.json({success:false, error:'Not authenticated'});
    }
};

module.exports = (function(){

    //public api
    var publicAPI={
        local:local,
        logoff:logoff,
        access:access,
        getUser:getUser,
        isAdmin:isAdmin
    };

    return publicAPI;
})();