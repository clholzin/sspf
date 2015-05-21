define(["app", "marionette"], function(AppManager, Marionette){
  var Router = Marionette.AppRouter.extend({
    appRoutes: {
      ":lang/about" : "showAbout"
    }
  });

  var API = {
    showAbout: function(lang){
      require(["apps/about/show/show_controller"], function(ShowController){
     AppManager.request("language:change", lang).always(function() {
        AppManager.startSubApp(null);
        ShowController.showAbout();
        AppManager.execute("set:active:header", "about");
      });
    });
    }
  };

  AppManager.on("about:show", function(){
    AppManager.navigate("about");
    API.showAbout();
  });

  AppManager.addInitializer(function(){
    new Router({
      controller: API
    });
  });

  return Router;
});
