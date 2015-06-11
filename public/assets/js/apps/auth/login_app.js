define(["app"], function(AppManager){
  AppManager.module("AuthApp", function(AuthApp, AppManager, Backbone, Marionette, $, _){
      AuthApp.startWithParent = false;

      AuthApp.onStart = function(){
      console.log("starting AuthApp");
    };

      AuthApp.onStop = function(){
      console.log("stopping AuthApp");
    };
  });

  AppManager.module("Routers.AuthApp", function(AuthAppRouter, AppManager, Backbone, Marionette, $, _){
      AuthAppRouter.Router = Marionette.AppRouter.extend({
      appRoutes: {
        ":lang/auth": "LoginAuthorized",
        ":lang/auth/:id": "showAuthorized",
        ":lang/dashboard/:id": "showDashboard",
        ":lang/auth/:id/edit": "editAuthorized",
        ":lang/auth/logout": "logoutAuthorized"
      }
    });

    var executeAction = function(action, arg,lang){
        AppManager.startSubApp("AuthApp");

        AppManager.request("language:change", lang).always(function() {
            //console.log(action(arg));
            //action(arg);
            //AppManager.execute("set:active:header", "auth");
        });
    };

    var API = {

     LoginAuthorized: function(){
        require(["apps/auth/login/login_controller"], function(LoginController){
            executeAction(LoginController.authUsers());
        });
        },
      showAuthorized: function(id){
        require(["apps/auth/login/login_controller"], function(LoginController){
            executeAction(LoginController.showUser(id));
        });
      },

      editAuthorized: function(id){
        require(["apps/auth/login/login_controller"], function(LoginController){
            executeAction(LoginController.editUser(id));
        });
      },

      logoutAuthorized: function(){
            require(["apps/auth/login/login_controller"], function(LoginController){
                executeAction(LoginController.logoutUser());
            });
      },

      showDashboard: function(name){
          require(["apps/auth/dashboard/show_controller"], function(ShowController){
              executeAction(ShowController.showDashboard(name));
          });
      }

    };

    AppManager.on("auth:login", function(){
      AppManager.navigate("auth");
      API.LoginAuthorized();
    });

    AppManager.on("auth:logout", function(){
      AppManager.navigate("auth/logout");
      API.logoutAuthorized();
    });

    AppManager.on("auth:show", function(id){
        if(id === undefined){
            AppManager.navigate("auth");
        }else{
            AppManager.navigate("auth/"+id);
        }
       API.showAuthorized(id);
    });

    AppManager.on("auth:edit", function(id){
      AppManager.navigate("auth/" + id + "/edit");
      API.editAuthorized(id);
    });

    AppManager.on("auth:dashboard", function(user){
      AppManager.navigate("dashboard/" + user);
      API.showDashboard(user);
    });

    AppManager.addInitializer(function(){
      new AuthAppRouter.Router({
        controller: API
      });
    });
  });

  return AppManager.AuthAppRouter;
});
