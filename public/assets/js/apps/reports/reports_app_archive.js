define(["app"], function(AppManager){
  AppManager.module("ReportsApp", function(ReportsApp, AppManager, Backbone, Marionette, $, _){
    ReportsApp.startWithParent = false;

      ReportsApp.onStart = function(){
      console.log("starting ReportsApp");
    };

      ReportsApp.onStop = function(){
      console.log("stopping ReportsApp");
    };
  });

  AppManager.module("Routers.ReportsApp", function(ReportsAppRouter, AppManager, Backbone, Marionette, $, _){
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

        }

    });

    var executeAction = function(action, args){
        console.log(JSON.stringify(action));
        console.log(JSON.stringify(args));
       // console.log('Check ReportsApp for login '+JSON.stringify(AppManager.user));
          /**  if (AppManager.user.loggedIn === 0 || undefined) {
                AppManager.trigger('auth:login');
                AppManager.execute("alert:show", {type: "warning", message: "Must be logged in."});
            }**/
        AppManager.startSubApp("ReportsApp");
        action(args);
        // AppManager.execute("set:active:header", "reports");
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

    AppManager.addInitializer(function(){
      new ReportsAppRouter.Router({
        controller: API
      });
    });
  });

  return AppManager.ReportsAppRouter;
});
