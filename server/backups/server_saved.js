/** DEPENDENCIES
// ============**/
var express = require("express"),
    //connect = require('connect'),
    //methodOverride  = require('method-override'),
    session = require('express-session'),
    //favicon = require('serve-favicon'),
    path = require('path'),
    http = require("http"),
    jade = require("jade"),
    port = (process.env.PORT || 8000),
    //app = module.exports = express(),
    mongoose = require('mongoose'),
    passport = require('passport'),
    //cookieParser = require('cookie-parser'),
    errorHandler = require('errorhandler'),
    bodyParser = require('body-parser'),
    moment = require('moment'),
    LocalStrategy = require('passport-local').Strategy,
    livereload = require('livereload');
// Start Node.js

var app = express();

var server = http.createServer(app);



//server.watch(__dirname + "/../public/assets");
// SERVER CONFIGURATION
// ====================
app.use(express["static"](__dirname + "/../public"));

//app.use(favicon(__dirname + '/assets/img/favicon.ico'));
// app.use(express.static('/'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });


//app.use(methodOverride('X-HTTP-Method-Override'));
//app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json({ type: 'application/*+json' }));
//app.use(express.session({ secret: 'keyboard cat' }));
//app.use(flash());
//app.use(app.router);
var sess = {
    secret: 'keyboard cat',
    cookie: { maxAge: 60000},
    resave: true,
    saveUninitialized: true
};
app.use(session(sess));
app.use(errorHandler({
    dumpExceptions:true,
    showStack:true
}));

//passport settings
app.use(passport.initialize());
app.use(passport.session());

// routes
var routes = require('./../routes/routes');
app.use('/',routes);
mongoose.connect('mongodb://localhost/passport_local_mongoose');
// passport config
var Account = require('./../models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());




app.use(function(req, res, next) {
        console.log(req.body);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization');
    res.header('Access-Control-Expose-Headers','cache-control,content-length,content-type,content-encoding,expires,vary,server,x-content-type-options,dataserviceversion,x-aspnet-version,x-powered-by,access-control-allow-origin,access-control-allow-methods,access-control-allow-headers,access-control-expose-headers,date,connection,x-final-url');
    res.header('Accept-encoding', 'application/json, charset=utf-8');
    res.header('Authorization', 'Basic Y2hvbHppbmdlcjoxMnF3IUBRVw==');
    res.header('Cookie', 'fetch');
    res.header('X-CSRF-Token', 'fetch');
    res.header('ETag', 'fetch');


     var csrfToken = res.getHeader('X-CSRF-Token'),
     contentType = res.getHeader('content-type'),
     contentLength = res.getHeader('content-length'),
     ETag = res.getHeader('ETag');
 /**   res.set({
        'X-CSRF-Token':csrfToken,
        'Content-Length': contentLength,
        'Cookie': 'Cookie',
        'ETag': ETag
    });**/

    //res.locals.user = req.user;
   // res.locals.authenticated = ! req.user.anonymous;
    console.log(req.method);
    console.log('session '+JSON.stringify(req.session));
   /** if(req.session.passport === undefined){
        console.log('Global catch');
       // res.jsonp({info:'Please Login','loggedIn':0});
       // res.redirect('/#auth');

    }**/
    next();
});



//mongoose.connect('mongodb://localhost/passport_local_mongoose');



app.get('/register',function(req, res) {
        //res.send("index");
        if(req.user){
            res.json({ id : req.user.id,username:req.user.username,loggedIn:1});
            console.log(req.user);
        }else{
            res.json({ info : 'Must Login Login'});
            console.log('no user found');
        }
        console.log('register route');

    });
app.post('/register',function(req, res) {
        console.log('post hit');
        console.log(req.body);
        Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
            if (err) {
                //return res.render("register", {info: "Sorry. That username already exists. Try again."});
                res.json({info:"Sorry. That username already exists. Try again.",loggedIn:0});
            }
            passport.authenticate('local')(req, res,function () {
                /**,{successFlash: 'Registered, please login.',successRedirect: '/#login'}**/
                //res.redirect('/#');
                //console.log(req.user.id);
                if(req.user.id === undefined || null){
                    console.log('error');
                    res.json({info:"There was an issue authenticating.",loggedIn:0});
                }
                res.json({ id : req.user.id,username:req.user.username,loggedIn:1});
                console.log('registered user');
            });
        });
    });





app.get('/login', function(req, res) {
    console.log('Login GET');
    console.log(req.isAuthenticated());
    if(req.isAuthenticated()){
        res.json({id:req.user.id,username:req.user.username,loggedIn:1});
    }else{
        console.log('error, unauthorized');
        res.json({info:'Check username or password and try again.',loggedIn:0});
    }
});
app.post('/login',passport.authenticate('local'),function(req,res) {
    console.log('login post hit');
    console.log(req.user);
    if(req.isAuthenticated()){
        res.json({id:req.user.id,username:req.user.username,loggedIn:1});
    }else{
        console.log('login post error');
        res.json({info:'error, unauthorized',loggedIn:0});
    }
});


app.put('/login/:id',function(req,res){
        console.log('change hit');
        var username = req.body.username;
        var pass = req.body.password;
        Account.findByUsername(username,function(err,user){
            if (err) {
                console.log(err);
                res.json({info:"Try again.",loggedIn:0});
            }
            user.setPassword(pass, function(err, user) {
                if (err) {
                    res.json({info:err});
                }
                user.save(function(err) {
                    if (err) {
                        res.json({info:err});
                    }
                    res.json(user);
                });
            });//set new pass and save
        });//findbyUser
    });


app.get('/logout', function(req, res) {
    req.logout();
    //res.redirect('/#login');
    console.log('logged out');
    res.json({ info : 'Log Out Confirmed',loggedIn:0});
});
/**
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
        res.json({
            message: err.message,
            error: err
        });
    });
}

 // production error handler
 // no stacktraces leaked to user
 app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});


 * **/
// SERVER
// ======
// Start Node.js Server
app.listen(port, function(){
    console.log('Marionette-Require-Boilerplate!\n\nPlease go to http://localhost:' + port);
});



