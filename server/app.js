var express         = require('express');
var session         = require('express-session');
var app             = express();
var compression     = require('compression');
var path            = require('path');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var multer          = require('multer');
var cors            = require("./libs/enable_cors")(app);
var upload          = multer({ dest: path.join(__dirname, 'public/uploads')});
var passport        = require('passport'); //authentication

// SETUP
app.use(compression()); // GZIP all assets
app.set('views', path.join(__dirname, 'views'));
app.set('partials',path.join(__dirname,'views/partials'));
app.set('view engine', 'jade');
//app.set('view cache', true);
app.enable('trust proxy');//set proxy on true, ip ophalen
app.use(logger('dev')); //logger
app.use(cookieParser()); //cookies
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));



//authentication
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  expires: true,
  saveUninitialized: false,
  path:"/*" //NEEDED
}));
app.use(passport.initialize());
app.use(passport.session());
require('./libs/auth');

//require('./libs/schedule');


//api routes
var routes    = require('./routes/index');
var error     = require('./routes/error');
var partials  = require('./routes/partials');
var auth      = require('./routes/api/auth');
var twitter   = require('./routes/api/twitter');
var data      = require('./routes/api/data');
var user      = require('./routes/api/user');
var schedule  = require('./routes/api/schedule');
var photo     = require('./routes/api/photo');

app.use('/api/auth', auth);
app.use('/api/twitter', twitter);
app.use('/api/data', data);
app.use('/api/user', user);
app.use('/api/schedule', schedule);
app.use('/api/photo', photo);
app.use('/partials',partials);
app.use('/404',error);


//angular
app.use('*', routes);
app.use('/', routes);


//standard
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('template/error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('template/error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;