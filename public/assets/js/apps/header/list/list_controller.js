define(["app", "apps/header/list/list_view"], function(AppManager, View){
  AppManager.module("HeaderApp.List", function(List, AppManager, Backbone, Marionette, $, _){
    List.Controller = {
      listHeader: function(){
        require(["entities/header"], function(){
          var links = AppManager.request("header:entities");
            //var links = AppManager.request("login:logout");
            //console.log(links);
          var headers = new View.Headers({collection: links});
           /** headers.on("show", function(childView){
                $('body').find('.Logout').hide();
            });**/

          headers.on("brand:clicked", function(){
            AppManager.trigger("auth:login");
            var menu = this.$('div.collapse');
            var does = menu.hasClass('in');
            if(does) {
                menu.collapse('toggle');
            }
          });

         /** headers.on("language:click", function(lang){
              AppManager.trigger("language:changed",lang);
          });**/
          headers.on("backBtn:clicked", function(childView, model){
            console.log('hit backBtn');
            window.history.back();
              var menu = this.$('div.collapse');
              var does = menu.hasClass('in');
              if(does) {
                  menu.collapse('toggle');
              }
          });
          headers.on("homeBtn:clicked", function(childView, model){
            AppManager.trigger('auth:login');
              var menu = this.$('div.collapse');
              var does = menu.hasClass('in');
              if(does) {
                  menu.collapse('toggle');
              }
          });
          headers.on("childview:navigate", function(childView, model){
            var trigger = model.get("navigationTrigger");
            AppManager.trigger(trigger,model.get('id'));
              console.log(childView);
              var menu = this.$('div.collapse');
              var does = menu.hasClass('in');
              if(does) {
                  menu.collapse('toggle');
              }
          });
            headers.on("language:change", function(lang){
                //console.log(lang);
               // AppManager.trigger('language:changed',lang);
                AppManager.request("language:change", lang);
            });

          AppManager.headerRegion.show(headers);
        });
      },

      setActiveHeader: function(headerUrl){
          console.log('Header Url  '+headerUrl);
        var links = AppManager.request("header:entities");
         console.log(JSON.stringify(links));
        var headerToSelect = links.find(function(header){ return header.get("url") === headerUrl; });
        headerToSelect.select();
        links.trigger("reset");
      },
      ResetActiveHeader: function(){
        var links = AppManager.request("header:entities");
          //console.log(links);
        var headerToReset = links.find(function(header){ return header.get("navigationTrigger") === 'auth:show'; });
          if(headerToReset === undefined){
              return;
          }
          headerToReset.set({name:'Login',url:'auth',navigationTrigger:'auth:login'});
          headerToReset.select();
          links.trigger("reset");
          $('nav').find('.Logout').hide();
      },
      setActiveUser: function(user){
          console.log('hit setActive User');
          var links = AppManager.request("header:entities");
          var headerToUser = links.find(function(header){ return header.get("name") === 'Login'; });
          if(headerToUser === undefined){
              return;
          }
          headerToUser.set({name:user.toUpperCase(),url:'auth/'+user,navigationTrigger:'auth:show'});
         // AppManager.execute("set:active:header", "auth:show");
          links.trigger("reset");
          $('nav').find('.Logout').show();
       },
      showAlert: function(object){
        var type = object.type,
            message = object.message,
            animate,
            alertsRegion =  $('div#alertsRegion');
        alertsRegion.removeAttr('style').empty();
        switch(type){
            case "danger":
            case "warning": animate = 'shake';
                break;
            case "info":
            case "success": animate = 'fadeIn';
                break;
        }
        var alertDiv = '<div class="animated '+animate+' alert alert-'+type+' alert-dismissible" role="alert">' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            '<strong>'+type.toUpperCase()+':</strong> '+message+'</div>';
        alertsRegion.prepend(alertDiv);
            setTimeout(function(){
                alertsRegion.fadeOut('slow',function(){
                    alertsRegion.empty();
                });
            },15000);
      }




    };
  });

  return AppManager.HeaderApp.List.Controller;
});
