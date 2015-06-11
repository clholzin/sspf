define(["app", "apps/header/list/list_controller"],
    function(AppManager, ListController,polyglot){
  AppManager.module("HeaderApp", function(Header, AppManager, Backbone, Marionette, $, _){
    var API = {
      listHeader: function(){
        ListController.listHeader();
      }
    };
    AppManager.commands.setHandler("set:active:header", function(name){
          ListController.setActiveHeader(name);
    });
    AppManager.commands.setHandler("set:user", function(name,id){
          ListController.setActiveUser(name,id);
     });
    AppManager.commands.setHandler("Reset:user", function(){
          ListController.ResetActiveHeader();
     });
    AppManager.commands.setHandler("alert:show", function(object){
          ListController.showAlert(object);
     });


    Header.on("start", function(){
        console.log('header started');
      API.listHeader();
    });
      AppManager.on("language:changed", function(lang){
          console.log('changed language: '+lang);
          //this is the primary trigger to change languages
          //AppManager.request("language:change", lang);

          API.listHeader();
      });
  });

  return AppManager.HeaderApp;
});
