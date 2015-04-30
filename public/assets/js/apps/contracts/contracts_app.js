define(["app"], function(AppManager){
    AppManager.module("ContractsApp", function(ContractsApp, AppManager, Backbone, Marionette, $, _){
        ContractsApp.startWithParent = false;

        ContractsApp.onStart = function(){
            console.log("starting ContractsApp");
        };

        ContractsApp.onStop = function(){
            console.log("stopping ContractsApp");
        };
    });

    AppManager.module("Routers.ContractsApp", function(ContractsAppRouter, AppManager, Backbone, Marionette, $, _){
        ContractsAppRouter.Router = Marionette.AppRouter.extend({
            appRoutes: {
                "contracts(/filter/criterion::criterion)": "listContracts",
                "contracts/:id": "showContract",
                "contracts/:id/edit": "editContract"
            }
        });

    var executeAction = function(action, arg){
        AppManager.startSubApp("ContractsApp");
        //console.log(action(arg));
         action(arg);
        AppManager.execute("set:active:header", "contracts");
    };


    var API = {
        listContracts: function(criterion){
            require(["apps/contracts/list/list_controller"], function(ListController){
                ListController.listContracts,criterion;
            });
        },
        showContract: function(){
            require(["apps/contracts/show/show_controller"], function(ShowController){
                ShowController.showContract();
           });
       },
        editContract: function(){
            require(["apps/contracts/edit/edit_controller"], function(EditController){
                EditController.editContract();
            });
        }
  };

        AppManager.on("contracts:filter", function(criterion){
            if(criterion){
                AppManager.navigate("contracts/filter/criterion:" + criterion);
            }
            else{
                AppManager.navigate("contracts");
            }
        });
        AppManager.on("contracts:list", function(){
            AppManager.navigate("contracts");
            API.listContracts();
        });
        AppManager.on("contracts:show", function(id){
            AppManager.navigate("contracts/"+id);
            API.showContract(id);
        });
        AppManager.on("contracts:edit", function(id){
            AppManager.navigate("contracts/"+id);
            API.editContract(id);
        });
       /** AppManager.on("contracts:new", function(){
            AppManager.navigate("contracts");
            API.newContracts();
        });**/

        AppManager.addInitializer(function(){
            new ContractsAppRouter.Router({
                controller: API
            });
        });
    });
    return AppManager.ContractsAppRouter;
});
