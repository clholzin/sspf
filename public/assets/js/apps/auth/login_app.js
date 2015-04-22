define(["app"], function(ContactManager){
  ContactManager.module("AuthApp", function(AuthApp, ContactManager, Backbone, Marionette, $, _){
      AuthApp.startWithParent = false;

      AuthApp.onStart = function(){
      console.log("starting AuthApp");
    };

      AuthApp.onStop = function(){
      console.log("stopping AuthApp");
    };
  });

  ContactManager.module("Routers.AuthApp", function(AuthAppRouter, ContactManager, Backbone, Marionette, $, _){
      AuthAppRouter.Router = Marionette.AppRouter.extend({
      appRoutes: {
        "auth": "LoginAuthorized",
        "auth/:id": "showAuthorized",
        "auth/:id/edit": "editAuthorized",
        "auth/logout": "logoutAuthorized"
      }
    });

    var executeAction = function(action, arg){
      ContactManager.startSubApp("AuthApp");
      //console.log(action(arg));
       // action(arg);
      ContactManager.execute("set:active:header", "auth");
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
      }
    };

    ContactManager.on("auth:login", function(){
      ContactManager.navigate("auth");
      API.LoginAuthorized();
    });
    ContactManager.on("auth:logout", function(){
      ContactManager.navigate("auth/logout");
      API.logoutAuthorized();
    });

    ContactManager.on("auth:show", function(id){
        if(id === undefined){
            ContactManager.navigate("auth/");
        }else{
            ContactManager.navigate("auth/"+id);
        }
       API.showAuthorized(id);
    });

    ContactManager.on("auth:edit", function(id){
      ContactManager.navigate("auth/" + id + "/edit");
      API.editAuthorized(id);
    });

    ContactManager.addInitializer(function(){
      new AuthAppRouter.Router({
        controller: API
      });
    });
  });

  return ContactManager.AuthAppRouter;
});
