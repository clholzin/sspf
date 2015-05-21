var express = require('express');
var passport = require('passport');
var Account = require('./../models/account');
var routes = express.Router();


routes.all(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
/**
     user.get('index', function (req, res) {
    //  res.json({ id : req.user.id,username:req.user.username,loggedIn:1});
    console.log(req.user.username);
});
     **/
    console.log('hit user routes');
    routes.post('/register', function (req, res, next) {
        Account.register(new Account({username: req.body.username}), req.body.password, function (err, account) {
            if (err) {
                console.log(err);
                //return res.render("register", {info: "Sorry. That username already exists. Try again."});
                return res.json({info: err.message, loggedIn: 0});
            }

            passport.authenticate('local')(req, res, function () {
                if (req.user.id === undefined || null) {
                    console.log('error');
                    res.json({info: "There was an issue authenticating.", loggedIn: 0});
                }
                res.json({id: req.user.id, username: req.user.username, loggedIn: 1});
                console.log('registered user');
            });
        });

    });


routes.get('/login', function (req, res) {
        if (!req.isAuthenticated()) {
            console.log('error, unauthorized');
            res.json({info: 'Check username or password and try again.', loggedIn: 0});
        } else {
            res.json({id: req.user.id, username: req.user.username, loggedIn: 1});
        }
    });

routes.post('/login', passport.authenticate('local'), function (req, res) {
        if (!req.isAuthenticated()) {
            console.log('error, unauthorized');
            res.json({info: 'Check username or password and try again.', loggedIn: 0});
        } else {
            res.json({id: req.user.id, username: req.user.username, loggedIn: 1});
        }
    });


routes.put('/login/:id', function (req, res) {
        console.log('change hit');
        var username = req.body.username;
        var pass = req.body.password;
        Account.findByUsername(username, function (err, user) {
            if (err) {
                console.log(err);
                res.json({info: "Try again.", loggedIn: 0});
            }
            user.setPassword(pass, function (err, user) {
                if (err) {
                    res.json({info: err});
                }
                user.save(function (err) {
                    if (err) {
                        res.json({info: err});
                    }
                    res.json(user);
                });
            });//set new pass and save
        });//findbyUser
    });


    /**Admin User Api**/
    routes.get('/admin/users', function (req, res) {
        console.log('get collection from mongo /admin/users');
        Account.find(function (err, users) {
            if (err) {
                console.log(err);
            }
            res.json(users);
        });
    });
routes.get('/admin/users/:id', function (req, res) {
        console.log('get collection from mongo by id');
        Account.findOne({_id: req.params.id}, function (err, user) {
            res.json(user);
        });
    });
routes.put('/admin/users/:id', function (req, res) {
        //console.log(req.body);
        console.log('put collection by id to mongo');
        Account.where({_id: req.params.id}).update({$set: {roles: req.body.roles}}, function (err, user) {
            res.status(200).json(user);
        });
    });
routes.delete('/admin/users/:id', function (req, res) {
        console.log(req.params.id);
        console.log('delete collection by id from mongo');
        Account.where({_id: req.params.id}).remove(function (err) {
            res.status(200);
        });
    });


routes.get('/logout', function (req, res) {
        req.logout();
        //res.redirect('/#login');
        console.log('logged out');
        res.json({info: 'Log Out Confirmed', loggedIn: 0});
    });

routes.get('/ping', function (req, res, next) {
        res.status(200).send("pong");
    next();
    });


module.exports = routes;