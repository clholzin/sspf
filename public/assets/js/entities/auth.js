/**
 * Created by craig on 4/13/2015.
 */
define(["app", "backbone.picky"], function(AppManager){
    AppManager.module("Entities", function(Entities, AppManager, Backbone, Marionette, $, _){
        Entities.Login = Backbone.Model.extend({
            urlRoot:'http://localhost:8000/login'
            //idAttribute: "_id",

        });
        Entities.Logout = Backbone.Model.extend({
            urlRoot:'http://localhost:8000/logout'

        });
        Entities.Register = Backbone.Model.extend({
            urlRoot:'http://localhost:8000/register',
            validate: function(attrs, options) {
                var errors = {};
                if (! attrs.username) {
                    errors.username = "Must provide a username";
                }
                if (! attrs.password) {
                    errors.password = "Please add a password.";
                }

                if( ! _.isEmpty(errors)){
                    return errors;
                }
            }

        });

        Entities.LoginCollection = Backbone.Collection.extend({
            url:'http://localhost:8000/login',
            model: Entities.Login

        });

        var initializeLogin = function(){
            var user = new Entities.LoginCollection([
                { id: 1, username: "default", password: "default", email: "default@default.com" }
                /**,
                { id: 1, username: "clholzin", password: "cc", email: "craig@default.com" },
                { id: 1, username: "bill", password: "bb", email: "bill@default.com" }**/
            ]);
            user.forEach(function(item){
                user.save(item);
            });
            return user.models;
        };

        var API = {
            getLoginEntities: function(){
                var users = new Entities.LoginCollection();
                var defer = $.Deferred();
                users.fetch({
                    success: function(data){
                        defer.resolve(data);
                    }
                });
                var promise = defer.promise();
                $.when(promise).done(function(users){
                    if(users.length === 0){
                        // if we don't have any contacts yet, create some for convenience
                        var models = initializeLogin();
                        users.reset(models);
                    }
                });
                return promise;
            },

            getLoginEntityId: function(id){
                var user = new Entities.LoginCollection({id:id});
                var defer = $.Deferred();
                setTimeout(function(){
                    user.fetch({
                        success: function(data){
                            defer.resolve(data);
                        },
                        error: function(data){
                            defer.resolve(undefined);
                        }
                    });
                }, 2000);
                return defer.promise();
            },

            getLoginEntity: function(){
                var user = new Entities.Login();
                var defer = $.Deferred();
                setTimeout(function(){
                    user.fetch({
                        success: function(data){
                            defer.resolve(data);
                        },
                        error: function(data){
                            defer.resolve(undefined);
                        }
                    });
                }, 2000);
                return defer.promise();
            },

            getLogout: function(){
                var user = new Entities.Logout();
                var defer = $.Deferred();
                setTimeout(function(){
                    user.fetch({
                        success: function(data){
                            defer.resolve(data);
                        },
                        error: function(data){
                            defer.resolve(undefined);
                        }
                    });
                }, 2000);
                return defer.promise();
            },


            getLogins: function(){
                if(Entities.logins === undefined){
                    initializeLogin();
                }
                return Entities.logins;
            }
        };

        AppManager.reqres.setHandler("login:entity", function(){
            return API.getLoginEntity();
        });
        AppManager.reqres.setHandler("login:logout", function(){
            return API.getLogout();
        });
        AppManager.reqres.setHandler("login:entity:id", function(id){
            return API.getLoginEntityId(id);
        });
        AppManager.reqres.setHandler("login:entities", function(){
            return API.getLoginEntities();
        });
        AppManager.reqres.setHandler("login:entity:new", function(){
            return new Entities.Register();
        });
    });

    return ;
});
