define(["app", "apps/header/list/list_controller"], function(ContactManager, ListController){
  ContactManager.module("HeaderApp", function(Header, ContactManager, Backbone, Marionette, $, _){
    var API = {
      listHeader: function(){
        ListController.listHeader();
      }
    };

    ContactManager.commands.setHandler("set:active:header", function(name){
          ListController.setActiveHeader(name);
    });
    ContactManager.commands.setHandler("set:user", function(name){
          ListController.setActiveUser(name);
     });
    ContactManager.commands.setHandler("Reset:user", function(){
          ListController.ResetActiveHeader();
     });
      ContactManager.commands.setHandler("alert:show", function(object){
          ListController.showAlert(object);
      });


    Header.on("start", function(){
        console.log('header started');
      API.listHeader();
    });
  });

  return ContactManager.HeaderApp;
});
