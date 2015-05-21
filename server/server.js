
// SERVER CONFIGURATION
// ====================

// dependencies
var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var http = require("http");
var bodyParser = require('body-parser');
var proxy = require('proxy-middleware');
var url = require('url');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var port = (process.env.PORT || 8000);


var app = module.exports = express();

var server = http.createServer(app);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/../public')));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/../public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

/**
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
**/
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({'error':{
            message: err.message,
            error:err
        }
        });
        next();
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({'error':{
        message: err.message,
        error:err
    }
    });
    next();
});

// passport config
var Account = require('./models/account.js');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());




var user = require('./routes/routes.js');
app.use(user);
var contracts = require('./routes/contracts.js');
var notify = require('./routes/contracts_notify.js');
//console.log(router);
app.use('/api/', [contracts,notify]);

app.use('/sap/ZUSER_SRV/USR01Set', proxy(url.parse('http://localhost:9000/sap/opu/odata/sap/ZUSER_SRV/USR01Set')));

var allowCrossDomain = function(req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization');
    res.header('Access-Control-Expose-Headers','cache-control,content-length,content-type,content-encoding,expires,vary,server,x-content-type-options,dataserviceversion,x-aspnet-version,x-powered-by,access-control-allow-origin,access-control-allow-methods,access-control-allow-headers,access-control-expose-headers,date,connection,x-final-url');
    res.header('Accept-encoding', 'application/json, charset=utf-8');
    res.header('X-CSRF-Token', 'fetch');
    res.header('Cookie', 'fetch');
    /** var eTag = res.header('ETag','fetch');
     var contentType = res.header('Content-Type');
     var contentLength = res.header('Content-Length');
     var cookieData = res.header('Cookie', 'fetch');
     var token = res.header('X-CSRF-Token', 'fetch');
     var t = res.set({
       //'Content-Type': contentType,
       'Content-Length': res.header('Content-Length'),
       'ETag': res.header('ETag','fetch'),
       'Cookie':res.header('Cookie', 'fetch'),
       'X-CSRF-Token':res.header('X-CSRF-Token', 'fetch')
   });
    console.log(JSON.stringify(t));**/
    next();
};
app.use(allowCrossDomain);





// SERVER
// ======
// Start Node.js Server
app.listen(port, function(){
    console.log('Dassian-Boilerplate!\n\nPlease go to http://localhost:' + port);
});



