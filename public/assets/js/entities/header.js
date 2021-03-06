define(["app", "backbone.picky"], function(AppManager){
  AppManager.module("Entities", function(Entities, AppManager, Backbone, Marionette, $, _){
    Entities.Header = Backbone.Model.extend({

      initialize: function(){
        var selectable = new Backbone.Picky.Selectable(this);
        _.extend(this, selectable);
      }
    });


    Entities.HeaderCollection = Backbone.Collection.extend({
      model: Entities.Header,

      initialize: function(){
        var singleSelect = new Backbone.Picky.SingleSelect(this);
        _.extend(this, singleSelect);
      }
    });

    var initializeHeaders = function(){
      Entities.headers = new Entities.HeaderCollection([
          { name: "Contracts", url: "contracts", navigationTrigger: "contracts:list" },
          { name: "Reports", url: "reports", navigationTrigger: "reports:list" },
          { name: "About", url: "about", navigationTrigger: "about:show"}
      /** { name: "Contacts", url: "contacts", navigationTrigger: "contacts:list" },
       *  { name: "Login", url: "auth", navigationTrigger: "auth:login" },
          { name: "Logout", url: "auth/logout", navigationTrigger: "auth:logout" }**/
      ]);
    };

    var API = {
      getHeaders: function(){
        if(Entities.headers === undefined){
          initializeHeaders();
            console.log('getting headers links');
        }
        return Entities.headers;
      }


    };


    AppManager.reqres.setHandler("header:entities", function(){
      return API.getHeaders();
    });

  });

  return ;
});
