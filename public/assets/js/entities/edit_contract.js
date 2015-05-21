define(["app", "backbone.picky","vendor/kendoUI/kendo.all.min"], function(AppManager){
  AppManager.module("Entities", function(Entities, AppManager, Backbone, Marionette, $, _){
    Entities.EditContract = Backbone.Model.extend({

      initialize: function(){
        var selectable = new Backbone.Picky.Selectable(this);
        _.extend(this, selectable);
      }
    });


    Entities.EditContractController = Backbone.Collection.extend({
      model: Entities.EditContract,

      initialize: function(){
        var singleSelect = new Backbone.Picky.SingleSelect(this);
        _.extend(this, singleSelect);
      }
    });

    var initializeEditContracts = function(){
      Entities.panelMenu = new Entities.EditContractController([
        { name: "Contract", url: "#", navigationTrigger: "contacts:show" },
          { name: "Reporting Dates", url: "#", navigationTrigger: "reporting:show"},
          { name: "Pricing", url: "#", navigationTrigger: "pricing:show" },
        { name: "Deliverables", url: "#", navigationTrigger: "deliverables:show" },
          { name: "Metrics", url: "#", navigationTrigger: "metrics:show" },
          { name: "Recover Bases", url: "#", navigationTrigger: "recoverBases:show" },
          { name: "Payments", url: "#", navigationTrigger: "payments:show" },
          { name: "Milestones", url: "#", navigationTrigger: "milestones:show" },
          { name: "SubContractors", url: "#", navigationTrigger: "subcontractors:show" }
      ]);
    };

    var API = {
      getEditContractsMenu: function(){
        if(Entities.panelMenu === undefined){
          initializeEditContracts();
            console.log('getting panelMenu links');
        }
        return Entities.panelMenu;
      }


    };


    AppManager.reqres.setHandler("editMenu:entities", function(){
      return API.getEditContractsMenu();
    });

  });

  return ;
});
