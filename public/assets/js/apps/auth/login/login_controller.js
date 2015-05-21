define(["app", "apps/auth/login/login_view"], function(AppManager, View){
    AppManager.module("AuthApp.Login", function(Login, AppManager, Backbone, Marionette, $, _){
        Login.Controller = {
            authUsers: function(id){
                require(["common/views", "entities/auth"], function(CommonViews){
                    var loadingView = new CommonViews.Loading({
                        title: "Login",
                        message: "One sec..."
                    });
                    AppManager.mainRegion.show(loadingView);
                    //var loginView;
                   var fetchingUser = AppManager.request("login:entity");
                    $.when(fetchingUser).done(function(loginUser) {
                        if (loginUser.attributes.loggedIn === 1) {
                            loginView = new View.Show({
                                model: loginUser
                            });
                            if(AppManager.user.loggedIn === undefined){
                                AppManager.user.loggedIn = loginUser.get('loggedIn');
                            }

                            AppManager.execute("set:user", loginUser.get("username"));
                            loginView.on("auth:edit", function (loginUser) {
                                AppManager.trigger("auth:edit", loginUser.get("id"));
                            });
                        }
                        else {
                            loginView = new View.LoginForm();
                            AppManager.user.loggedIn = 0;
                            console.log('Logout Global Class '+JSON.stringify(AppManager.user.loggedIn));
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
                                        AppManager.user.loggedIn = model.get('loggedIn');
                                        //console.log('Logined Global User attr '+ JSON.stringify(AppManager.user));
                                        AppManager.execute("alert:show",({type:"success",message:"Welcome"}));
                                        AppManager.execute("set:user", model.get("username"));
                                        AppManager.trigger("auth:show", model.get("username"));
                                    }else{
                                        AppManager.execute("alert:show",({type:"warning",message:JSON.stringify(model.attributes.info)}));
                                        AppManager.triggerMethod("form:data:invalid", loginView.validationError);
                                    }
                                },
                                error: function (model, response) {
                                    console.log("error:"+JSON.stringify(response));
                                    if(response.status === 400){
                                       // AppManager.triggerMethod("form:data:invalid", loginView.validationError);
                                        AppManager.execute("alert:show",({type:"warning",message:JSON.stringify('Please enter username and password.')}));
                                    }
                                    if(response.status === 401){
                                        //AppManager.triggerMethod("form:data:invalid", loginView.validationError);
                                        AppManager.execute("alert:show",({type:"info",message:JSON.stringify('Username or Password incorrect.')}));
                                    }
                                }
                            });

                        });

                        loginView.on("form:register", function(data){
                            console.log('hit register form: '+ data.username);
                            var registerUser = AppManager.request("login:entity:new");
                            //console.log(registerUser);
                            var self = this;
                            registerUser.save(data,{
                                success:function(model,response){
                                    if(model.attributes.loggedIn === 1){
                                        //loginUser.add(loginUser);
                                        loginView.model = model;
                                        AppManager.user.loggedIn = model.get('loggedIn');
                                        AppManager.execute("alert:show",({type:"success",message:"Welcome"}));
                                        AppManager.execute("set:user", model.get("username"));
                                        AppManager.trigger("auth:show", model.get("username"));
                                    }else{
                                        AppManager.execute("alert:show",({type:"warning",message:JSON.stringify(model.attributes.info)}));
                                        AppManager.triggerMethod("form:data:invalid", registerUser.validationError);
                                    }
                                },
                                error: function (model, response) {
                                    console.log("error");
                                    if(response.statusText === 'Unauthorized'){
                                        AppManager.triggerMethod("form:data:invalid", registerUser.validationError);
                                        AppManager.execute("alert:show",({type:"warning",message:JSON.stringify(model.attributes.info)}));
                                    }
                                   //alert(JSON.stringify(response.statusText));
                                }
                            });
                        });

                        AppManager.mainRegion.show(loginView);
                    });
                });
            },

            editUser: function(id){
                require(["common/views", "entities/auth"], function(CommonViews){
                    var loadingView = new CommonViews.Loading({
                        title: "Edit User",
                        message: "loading..."
                    });
                    AppManager.mainRegion.show(loadingView);
                    var fetchingUser = AppManager.request("login:entity");
                    $.when(fetchingUser).done(function(user){
                        var view;
                        if(user.get('loggedIn') != 0){
                            view = new View.Edit({
                                model: user,
                                generateTitle: false
                            });

                            view.on("form:change", function(data){
                                if(user.save(data)){
                                    AppManager.trigger("auth:show", user.get('username'));
                                }
                                else{
                                    view.triggerMethod("form:data:invalid", user.validationError);
                                }
                            });
                        }
                        else{
                            view = new View.NoAuthView();
                        }

                        AppManager.mainRegion.show(view);
                    });
                });
            },

            showUser:function(id){
                require(["common/views", "entities/auth"], function(CommonViews){
                    var loadingView = new CommonViews.Loading({
                        title: "Display User",
                        message: "loading..."
                    });
                    AppManager.mainRegion.show(loadingView);
                    var fetchingUser = AppManager.request("login:entity");
                    $.when(fetchingUser).done(function(user){
                        var authView;
                        console.log(user.attributes.loggedIn);
                        //console.log(user.models[0].attributes.loggedIn);
                        if(user.attributes.loggedIn != 0){
                            authView = new View.Show({
                                model: user
                            });
                            authView.on("auth:edit", function(user){
                                AppManager.trigger("auth:edit", user.get("id"));
                            });
                        }
                        else{
                            authView = new View.NoAuthView();
                        }

                        AppManager.mainRegion.show(authView);
                    });
                });
            },

            logoutUser:function(){
                require(["common/views", "entities/auth"], function(CommonViews){
                    var loadingView = new CommonViews.Loading({
                        title: "Logout User",
                        message: "loading..."
                    });
                    AppManager.execute("alert:show",({type:"info",message:"Logging out"}));
                    AppManager.execute("Reset:user");
                    AppManager.execute("set:active:header", "auth/logout");
                    AppManager.mainRegion.show(loadingView);
                    var logout = AppManager.request("login:logout");
                    $.when(logout).done(function(data){
                       // console.log(data);
                         authView = new View.NoAuthView();
                         AppManager.user.loggedIn = data.attributes.loggedIn;
                        console.log('logout delete attribute:' + JSON.stringify(AppManager.user));
                            AppManager.mainRegion.show(authView);
                        setTimeout(function(){
                            AppManager.trigger("auth:login");
                        },4000);

                    });
                });//end LogoutUser function


            }
        }
    });

    return AppManager.AuthApp.Login.Controller;
});
