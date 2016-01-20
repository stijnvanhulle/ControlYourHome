var passport                = require('passport');
var LocalStrategy           = require('passport-local').Strategy;
var User                    = require('../data/models/user');
var md5                     = require('md5');

function findByEmail(email,password, fn) {
    User.find({email:email, password:md5(password)}).populate('type').exec(function (err, result){
        if (err) throw err;
        var user= result[0];

        if(user!=null && user.length!=0 && user.active==true){
            return fn(null, user);
        }else{
            return fn(null, null);
        }
    });




}

passport.use('local',new LocalStrategy({
        passReqToCallback : true,
        usernameField: 'email',
        passwordField: 'password'
    },
    function(body, email, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            findByEmail(email,password, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                console.log(user);
                return done(null, user);
            })
        });
    }
));


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});