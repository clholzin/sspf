define(["marionette",
        "apps/config/marionette/regions/dialog",
        "apps/config/marionette/regions/model"],
    function(Marionette){
  var AppManager = new Marionette.Application();

  AppManager.navigate = function(route,  options){
    options || (options = {});
       route = AppManager.i18n.currentLanguage + "/" + route;
    Backbone.history.navigate(route, options);
      console.log(JSON.stringify(route)+"  "+JSON.stringify(options));
  };
    /**global User Object**/
    AppManager.user = {};

    /**getCurrentRoute**/
  AppManager.getCurrentRoute = function(){
    return Backbone.history.fragment
  };

    /**Behaviors**/
    Marionette.Behaviors.behaviorsLookup = function() {
      //  window.Behaviors.ToolTip = ToolTip;
        //window.Behaviors.DestroyWarn = DestroyWarn;
    };


    /**Start Each Sub Module as its own page hash**/
  AppManager.startSubApp = function(appName, args){

      console.log(appName +': ' +  args );
    var currentApp = appName ? AppManager.module(appName) : null;
    if (AppManager.currentApp === currentApp){ return; }

    if (AppManager.currentApp){
      AppManager.currentApp.stop();
    }

    AppManager.currentApp = currentApp;
    if(currentApp){
      currentApp.start(args);
    }
  };



    AppManager.addRegions({
        headerRegion: "#header-region",
        alertsRegion: "#alertsRegion",
        loadingRegion:"#loadingRegion",
        mainRegion: "#main-region",
        footerRegion:"footer",
        dialogRegion: Marionette.Region.Dialog.extend({
            el: "#dialog-region"
        }),
        modelRegion: Marionette.Region.Model.extend({
            el: "#dialog-region"
        })
    });


    AppManager.reqres.setHandler("language:change", function(lang){
        var defer = $.Deferred(),
            currentRoute = AppManager.getCurrentRoute().split("/").slice(1).join("/");
        if(AppManager.i18n.acceptedLanguages.indexOf(lang) > -1){
            if(AppManager.i18n.currentLanguage !== lang){
                var translationFetched = $.get("languages/" + lang);
                $.when(translationFetched).done(function(translation){
                    polyglot.extend(translation);
                    AppManager.i18n.currentLanguage = lang;
                    AppManager.trigger("language:changed",lang);
                    AppManager.navigate(currentRoute, {trigger: true});
                    defer.resolve();
                }).fail(function(){
                    defer.reject();
                    alert(t("contact").generic.unprocessedError);
                });
            }
            else{
                defer.resolve();
            }
        }
        else{
            defer.reject();
            AppManager.navigate(currentRoute);
        }
        return defer.promise();
    });

    AppManager.on("before:start", function(options){
        options || (options = {});
        AppManager.i18n = {
            acceptedLanguages: options.acceptedLanguages || [],
            currentLanguage: "en"
        };
/**
        _.templateSettings = {
            interpolate: /\{\{=(.+?)\}\}/g,
            escape: /\{\{-(.+?)\}\}/g,
            evaluate: /\{\{(.+?)\}\}/g
        };

        var RegionContainer = Marionette.LayoutView.extend({
            el: "#app-container",

            regions: {
                header: "#header-region",
                main: "#main-region",
                dialog: "#dialog-region"
            }**/
        });

      ///  AppManager.regions = new RegionContainer();
        AppManager.on("start", function(){
            AppManager.i18n.acceptedLanguages = ["en", "fr","rs"];
            //AppManager.user.loggedIn = 0;
            if(Backbone.history){
                require(["apps/auth/login_app","apps/contacts/contacts_app",
                    "apps/about/about_app","apps/contracts/contracts_app",
                    "apps/reports/reports_app"], function () {
                    Backbone.history.start();

                    if(AppManager.getCurrentRoute() ===  ''){///^[en|auth|#|\/]/
                        AppManager.trigger("auth:login");
                    }
                });
            }
        });


  return AppManager;
});
