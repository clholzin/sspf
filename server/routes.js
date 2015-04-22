var passport = require('passport');
var Account = require('./models/account');
var User = require('./models/users');
module.exports = function (app) {

    app.get('/', function (req, res) {
        res.json({ id : req.user.id,username:req.user.username,loggedIn:1});
            console.log('logged In');
    });

    app.get('/index', function (req, res) {
        res.json({ id : req.user.id,username:req.user.username,loggedIn:1});
            console.log(req.user);
    });






    /**Admin User Api**/




    app.get('/admin/users', function(req, res){
        console.log('get collection from mongo /admin/users');
        Account.find(function(err, users) {
            if(err){
                console.log(err);
            }
            res.json(users);
        });
    });

    app.get('/admin/users/:id', function(req, res){
        console.log('get collection from mongo by id');
        Account.findOne( { _id: req.params.id }, function(err, user) {
            res.json(user);
        });
    });
/**
    app.post('/admin/users', function(req, res){
        var doRequest = { username: req.body.username,roles: req.body.roles };
        console.log(doRequest);
        console.log('post collection to mongo');
        Account.save(doRequest, function(err, task) {
            res.status(201);
            res.json(task);
        });
    });
**/
    app.put('/admin/users/:id', function(req, res){
        console.log('put collection by id to mongo');
        Account.where({ _id: req.params.id }).update({ $set: { roles: req.body.roles } }, function(err, user) {
            if(err){
                console.log(err);
            }
            res.status(200);
            res.json(user);
        });
    });

    app.delete('/admin/users/:id', function(req, res){
        console.log('delete collection by id from mongo');
        console.log(req.body);
        Account.where({ _id: req.params.id }).remove( function(err) {
            if(err){
                console.log(err);
            }
            res.send().status(200);
        });
    });












    app.get('/register', function(req, res) {
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

    app.post('/register', function(req, res) {
        console.log('post hit');
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
        if(!req.session.passport.user){
            console.log('error, unauthorized');
            return res.send({info:'Check username or password and try again.',loggedIn:0});
        }else{
            res.json({id:req.user.id,username:req.user.username,loggedIn:1});
        }
    });

    app.post('/login',passport.authenticate('local'),
        function(req,res) {
        console.log('login post hit');
            if(!req.session.passport.user){
                console.log('login post err');
                res.send({info:'error, unauthorized',loggedIn:0});
            }else{
                res.json({id:req.user.id,username:req.user.username,loggedIn:1});
            }
    });

    app.put('/login/:id',function(req,res){
        console.log('change hit');
        var username = req.body.username;
        var pass = req.body.password;
        Account.findByUsername(username,function(err,user){
            if (err) {
                console.log(err);
                return res.json({info:"Try again.",loggedIn:0});
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

    app.get('/ping', function(req, res){
        res.send("pong!", 200);
        res.write("pong");
    });
};
/**
 * Created by Craig on 2/17/2015.
 */
