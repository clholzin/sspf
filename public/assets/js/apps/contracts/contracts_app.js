define(["app"], function(AppManager) {
    AppManager.module("ContractsApp", function (ContractsApp, AppManager, Backbone, Marionette, $, _,Moment) {
        ContractsApp.startWithParent = false;

        ContractsApp.onStart = function () {
            console.log("starting ContractsApp");
        };

        ContractsApp.onStop = function () {
            console.log("stopping ContractsApp");
        };
    });


    AppManager.module("Routers.ContractsApp", function (ContractsAppRouter, AppManager, Backbone, Marionette, $, _) {
        ContractsAppRouter.Router = Marionette.AppRouter.extend({
            appRoutes: {
                ":lang/contracts(/filter/criterion::criterion)": "listContracts",
                ":lang/contracts/:id": "showContract",
                ":lang/contracts/:id/edit": "editContract"
            },
            execute: function(callback, args){
                var lang = args[0],
                    params = args[1],
                    query = args[2] || '',
                    options = '';
                console.log(args);
                AppManager.request("language:change", lang).always(function(){
                    if(params){
                        if(params.indexOf(":") < 0){
                            options = params;
                        }
                        else{
                            if(params !== ''){
                                params = params.split('+');
                                _.each(params, function(param){
                                    var values = param.split(':');
                                    if(values[1]){
                                        if(values[0] === "page"){
                                            options[values[0]] = parseInt(values[1], 10);
                                        }
                                        else{
                                            options[values[0]] = values[1];
                                        }
                                    }
                                });
                            }
                        }
                    }

                   // _.defaults(options, { page: 1 });
                    if(callback){
                        callback.call(this, options);
                    }
                });
            }
        });
       /** var serializeParams = function(options){
            options = _.pick(options, "criterion", "page");
            return (_.map(_.filter(_.pairs(options), function(pair){ return pair[1]; }), function(pair){ return pair.join(":"); })).join("+");
        };
**/
        var executeAction = function (action, args, lang) {
                AppManager.startSubApp("ContractsApp");
                console.log(action(JSON.stringify(args)));
                action(args);
                AppManager.execute("set:active:header", "contracts");
        };


        var API = {
            listContracts: function (criterion) {
                require(["apps/contracts/list/list_controller"], function (ListController) {
                    executeAction(ListController.listContracts,criterion);
                });
            },
            showContract: function (id) {
                require(["apps/contracts/show/show_controller"], function (ShowController) {
                    executeAction(ShowController.showContract,id);
                });
            },
            editContract: function (id) {
                require(["apps/contracts/edit/edit_controller"], function (EditController) {
                    executeAction(EditController.editContract,id);
                });
            }
        };
        AppManager.commands.setHandler("set:edit:header", function(name){
            AppManager.ContractsApp.Edit.Controller.setActiveHeader(name);
        });
        AppManager.on("contracts:filter", function (criterion) {
            if (criterion) {
                AppManager.navigate("contracts/filter/criterion:" + criterion);
            }
            else {
                AppManager.navigate("contracts");
            }
        });
        AppManager.on("contracts:list", function () {
            AppManager.navigate("contracts");
            API.listContracts();
        });
        AppManager.on("contract:show", function (id) {
            AppManager.navigate("contracts/" + id);
            API.showContract(id);
        });
        AppManager.on("contract:edit", function (id) {
            AppManager.navigate("contracts/" + id+"/edit");
            API.editContract(id);
        });
        /**  AppManager.on("contracts:new", function () {
            AppManager.navigate("contracts/new");
         require(["apps/contracts/new/new_view"], function (View) {
                new View.Contract;
            });
        });**/

        AppManager.addInitializer(function () {
            new ContractsAppRouter.Router({
                controller: API
            });
        });
    });
    return AppManager.ContractsAppRouter;
});