define(["app", "apps/auth/login/login_view"], function(ContactManager, View){
    ContactManager.module("AuthApp.Login", function(Login, ContactManager, Backbone, Marionette, $, _){
        Login.Controller = {
            authUsers: function(id){
                require(["common/views", "entities/auth"], function(CommonViews){
                    var loadingView = new CommonViews.Loading({
                        title: "Login",
                        message: "One sec..."
                    });
                    ContactManager.mainRegion.show(loadingView);
                    //var loginView;
                   var fetchingUser = ContactManager.request("login:entity");
                    $.when(fetchingUser).done(function(loginUser) {
                        if (loginUser.attributes.loggedIn === 1) {
                            loginView = new View.Show({
                                model: loginUser
                            });
                            if(ContactManager.user.loggedIn === undefined){
                                ContactManager.user.loggedIn = loginUser.get('loggedIn');
                            }
                            ContactManager.execute("set:user", loginUser.get("username"));
                            loginView.on("auth:edit", function (loginUser) {
                                ContactManager.trigger("auth:edit", loginUser.get("id"));
                            });
                        }
                        else {
                            loginView = new View.LoginForm();
                            ContactManager.user.loggedIn = 0;
                        }

                        loginView.on("form:submit", function(data){
                            console.log('hit submit form: '+ data.username);
                            var self = this;
                            loginUser.save(data, {
                                success: function (model, response) {
                                    console.log("success");
                                    if(model.attributes.loggedIn === 1){
                                        model.set(response);
                                        loginView.model = model;
                                        ContactManager.user.loggedIn = model.get('loggedIn');
                                        //console.log('Logined Global User attr '+ JSON.stringify(ContactManager.user));
                                        ContactManager.execute("alert:show",({type:"success",message:"Welcome"}));
                                        ContactManager.execute("set:user", model.get("username"));
                                        ContactManager.trigger("auth:show", model.get("username"));
                                    }else{
                                        ContactManager.execute("alert:show",({type:"warning",message:JSON.stringify(model.attributes.info)}));
                                        ContactManager.triggerMethod("form:data:invalid", loginView.validationError);
                                    }
                                },
                                error: function (model, response) {
                                    console.log("error");
                                    if(response.statusText === 'Unauthorized'){
                                        ContactManager.triggerMethod("form:data:invalid", loginView.validationError);
                                        ContactManager.execute("alert:show",({type:"warning",message:JSON.stringify(model.attributes.info)}));
                                    }
                                }
                            });

                        });

                        loginView.on("form:register", function(data){
                            console.log('hit register form: '+ data.username);
                            var registerUser = ContactManager.request("login:entity:new");
                            //console.log(registerUser);
                            var self = this;
                            registerUser.save(data,{
                                success:function(model,response){
                                    if(model.attributes.loggedIn === 1){
                                        //loginUser.add(loginUser);
                                        loginView.model = model;
                                        ContactManager.user.loggedIn = model.get('loggedIn');
                                        ContactManager.execute("alert:show",({type:"success",message:"Welcome"}));
                                        ContactManager.execute("set:user", model.get("username"));
                                        ContactManager.trigger("auth:show", model.get("username"));
                                    }else{
                                        ContactManager.execute("alert:show",({type:"warning",message:JSON.stringify(model.attributes.info)}));
                                        ContactManager.triggerMethod("form:data:invalid", loginView.validationError);
                                    }
                                },
                                error: function (model, response) {
                                    console.log("error");
                                    if(response.statusText === 'Unauthorized'){
                                        ContactManager.triggerMethod("form:data:invalid", loginView.validationError);
                                        ContactManager.execute("alert:show",({type:"warning",message:JSON.stringify(model.attributes.info)}));
                                    }
                                   //alert(JSON.stringify(response.statusText));
                                }
                            });
                        });

                        ContactManager.mainRegion.show(loginView);
                    });
                });
            },

            editUser: function(id){
                require(["common/views", "entities/auth"], function(CommonViews){
                    var loadingView = new CommonViews.Loading({
                        title: "Edit User",
                        message: "loading..."
                    });
                    ContactManager.mainRegion.show(loadingView);
                    var fetchingUser = ContactManager.request("login:entity");
                    $.when(fetchingUser).done(function(user){
                        var view;
                        if(user.get('loggedIn') != 0){
                            view = new View.Edit({
                                model: user,
                                generateTitle: false
                            });

                            view.on("form:change", function(data){
                                if(user.save(data)){
                                    ContactManager.trigger("auth:show", user.get('username'));
                                }
                                else{
                                    view.triggerMethod("form:data:invalid", user.validationError);
                                }
                            });
                        }
                        else{
                            view = new View.NoAuthView();
                        }

                        ContactManager.mainRegion.show(view);
                    });
                });
            },

            showUser:function(id){
                require(["common/views", "entities/auth"], function(CommonViews){
                    var loadingView = new CommonViews.Loading({
                        title: "Display User",
                        message: "loading..."
                    });
                    ContactManager.mainRegion.show(loadingView);
                    var fetchingUser = ContactManager.request("login:entity");
                    $.when(fetchingUser).done(function(user){
                        var authView;
                        console.log(user.attributes.loggedIn);
                        //console.log(user.models[0].attributes.loggedIn);
                        if(user.attributes.loggedIn != 0){
                            authView = new View.Show({
                                model: user
                            });
                            authView.on("auth:edit", function(user){
                                ContactManager.trigger("auth:edit", user.get("id"));
                            });
                        }
                        else{
                            authView = new View.NoAuthView();
                        }

                        ContactManager.mainRegion.show(authView);
                    });
                });
            },

            logoutUser:function(){
                require(["common/views", "entities/auth"], function(CommonViews){
                    var loadingView = new CommonViews.Loading({
                        title: "Logout User",
                        message: "loading..."
                    });
                    ContactManager.execute("alert:show",({type:"info",message:"Logging out"}));
                    ContactManager.execute("Reset:user");
                    ContactManager.execute("set:active:header", "auth/logout");
                    ContactManager.mainRegion.show(loadingView);
                    var logout = ContactManager.request("login:logout");
                    $.when(logout).done(function(data){
                       // console.log(data);
                    authView = new View.NoAuthView();
                         ContactManager.user.loggedIn = data.attributes.loggedIn;
                        console.log('logout delete attribute:' + JSON.stringify(ContactManager.user));
                            ContactManager.mainRegion.show(authView);
                    });
                });
            }
        }
    });

    return ContactManager.AuthApp.Login.Controller;
});
