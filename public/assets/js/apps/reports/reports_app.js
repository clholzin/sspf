define(["app"], function(AppManager) {
    AppManager.module("ReportsApp", function (ReportsApp, AppManager, Backbone, Marionette, $, _,Moment) {
        ReportsApp.startWithParent = false;

        ReportsApp.onStart = function () {
            console.log("starting ReportsApp");
        };

        ReportsApp.onStop = function () {
            console.log("stopping ReportsApp");
        };
    });


    AppManager.module("Routers.ReportsApp", function (ReportsAppRouter, AppManager, Backbone, Marionette, $, _) {
        ReportsAppRouter.Router = Marionette.AppRouter.extend({
            appRoutes: {
                ":lang/reports(/filter/criterion::criterion)": "allReports",
                ":lang/report/:id": "displayReport",
                ":lang/report/:id/edit": "changeReport"
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

            if (AppManager.user.loggedIn === 0 || undefined) {
                AppManager.trigger('auth:login');
                AppManager.execute("alert:show", {type: "warning", message: "Must be logged in."});
            } else {
                AppManager.startSubApp("ReportsApp",args);
                console.log(JSON.stringify(args));
                action(args);
                // AppManager.execute("set:active:header", "contracts");
            }

        };


        var API = {
            allReports: function(criterion){
                require(["apps/reports/list/list_controller"], function(ListController){
                    executeAction(ListController.listReports, criterion);
                });
            },

            displayReport: function(id){
                require(["apps/reports/show/show_controller"], function(ShowController){
                    executeAction(ShowController.showReport, id);
                });
            },

            changeReport: function(id){
                require(["apps/reports/edit/edit_controller"], function(EditController){
                    executeAction(EditController.editReport, id);
                });
            }
        };

        AppManager.on("reports:list", function(){
            AppManager.navigate("reports");
            API.allReports();
        });

        AppManager.on("reports:filter", function(criterion){
            if(criterion){
                AppManager.navigate("reports/filter/criterion:" + criterion);
            }
            else{
                AppManager.navigate("reports");
            }
        });

        AppManager.on("report:show", function(id){
            AppManager.navigate("report/" + id);
            API.displayReport(id);
        });

        AppManager.on("report:edit", function(id){
            AppManager.navigate("report/" + id + "/edit");
            API.changeReport(id);
        });

        AppManager.addInitializer(function () {
            new ReportsAppRouter.Router({
                controller: API
            });
        });
    });
    return AppManager.ReportsAppRouter;
});