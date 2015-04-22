/**
 * Created by craig on 4/13/2015.
 */
define(["app", "backbone.picky"], function(ContactManager){
    ContactManager.module("Entities", function(Entities, ContactManager, Backbone, Marionette, $, _){
        Entities.Login = Backbone.Model.extend({
            urlRoot:'http://localhost:8000/login',
            initialize: function(){
                var selectable = new Backbone.Picky.Selectable(this);
               // console.log(this);
                _.extend(this, selectable);
            }
        });
        Entities.Logout = Backbone.Model.extend({
            urlRoot:'http://localhost:8000/logout',
            initialize: function(){
                var selectable = new Backbone.Picky.Selectable(this);
                _.extend(this, selectable);
            }
        });
        Entities.Register = Backbone.Model.extend({
            urlRoot:'http://localhost:8000/register',
            initialize: function(){
                var selectable = new Backbone.Picky.Selectable(this);
                //console.log(this);
                _.extend(this, selectable);
            }
        });

        Entities.LoginCollection = Backbone.Collection.extend({
            url:'http://localhost:8000/login',
            model: Entities.Login,

            initialize: function(){
                var singleSelect = new Backbone.Picky.SingleSelect(this);
                _.extend(this, singleSelect);
               // console.log(this);
            }
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

        ContactManager.reqres.setHandler("login:entity", function(){
            return API.getLoginEntity();
        });
        ContactManager.reqres.setHandler("login:logout", function(){
            return API.getLogout();
        });
        ContactManager.reqres.setHandler("login:entity:id", function(id){
            return API.getLoginEntityId(id);
        });
        ContactManager.reqres.setHandler("login:entities", function(){
            return API.getLoginEntities();
        });
        ContactManager.reqres.setHandler("login:entity:new", function(id){
            return new Entities.Register();
        });
    });

    return ;
});
