define(["marionette", "apps/config/marionette/regions/dialog"], function(Marionette){
  var ContactManager = new Marionette.Application();

  ContactManager.addRegions({
    headerRegion: "#header-region",
      alertsRegion: "#alertsRegion",
    mainRegion: "#main-region",
    dialogRegion: Marionette.Region.Dialog.extend({
      el: "#dialog-region"
    })
  });

  ContactManager.navigate = function(route,  options){
    options || (options = {});
    Backbone.history.navigate(route, options);
      console.log(route+"  "+options);
  };

    ContactManager.user = {};

  ContactManager.getCurrentRoute = function(){
    return Backbone.history.fragment
  };

  ContactManager.startSubApp = function(appName, args){
      console.log(appName +': ' + args);
    var currentApp = appName ? ContactManager.module(appName) : null;
    if (ContactManager.currentApp === currentApp){ return; }

    if (ContactManager.currentApp){
      ContactManager.currentApp.stop();
    }

    ContactManager.currentApp = currentApp;
    if(currentApp){
      currentApp.start(args);
    }
  };

  ContactManager.on("start", function(){
    if(Backbone.history){
      require(["apps/contacts/contacts_app","apps/auth/login_app", "apps/about/about_app"], function () {
        Backbone.history.start();

        if(ContactManager.getCurrentRoute() === ""){
          ContactManager.trigger("auth:login");
        }
      });
    }
  });


  return ContactManager;
});
