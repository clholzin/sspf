define(["app", "apps/header/list/list_view"], function(AppManager, View){
  AppManager.module("HeaderApp.List", function(List, AppManager, Backbone, Marionette, $, _){
    List.Controller = {
      listHeader: function(){
        require(["entities/header"], function(){
         // var links = AppManager.request("header:entities");
            //var links = AppManager.request("login:logout");
            //console.log(links);
          var footer =  new View.Footer({});
         // var headers = new View.Headers({collection: links});
            var headers = new View.Headers();
           /** headers.on("show", function(childView){
                $('body').find('.Logout').hide();
            });**/
            /** headers.on("language:click", function(lang){
              AppManager.trigger("language:changed",lang);
          });**/
            headers.on("brand:clicked", function(){
                var navCollapse = this.$el.find('div.navbar-collapse');
                var does = navCollapse.hasClass('in');
                if(does) {
                    navCollapse.collapse('toggle');
                }
                AppManager.trigger("auth:login");
            });
            headers.on("backBtn:clicked", function(){
                console.log('hit backBtn');
                var navCollapse = this.$el.find('div.navbar-collapse');
                var does = navCollapse.hasClass('in');
                if(does) {
                    navCollapse.collapse('toggle');
                }
                window.history.back();
            });
            headers.on("homeBtn:clicked", function(){
                var navCollapse = this.$el.find('div.navbar-collapse');
                var does = navCollapse.hasClass('in');
                if(does) {
                    navCollapse.collapse('toggle');
                }
                AppManager.trigger('auth:login');
            });
            headers.on("dashboardBtn:dashboard", function(name){
                var navCollapse = this.$el.find('div.navbar-collapse');
                var does = navCollapse.hasClass('in');
                if(does) {
                    navCollapse.collapse('toggle');
                }
                AppManager.trigger('auth:dashboard',name);
            });
            headers.on("settingsBtn:settings", function(id){
                var navCollapse = this.$el.find('div.navbar-collapse');
                var does = navCollapse.hasClass('in');
                if(does) {
                    navCollapse.collapse('toggle');
                }
                AppManager.trigger('auth:show',id);
            });

            headers.on("admin:contacts", function(childView, model){
                var navCollapse = this.$el.find('div.navbar-collapse');
                var nav = navCollapse.hasClass('in');
                if(nav) {
                    navCollapse.collapse('toggle');
                }
                AppManager.trigger('contacts:list');
               // AppManager.execute("set:active:header");
            });
            headers.on("logoutBtn:logout", function(childView, model){
                var menu = this.$el.find('li.dropdown');
                var does = menu.hasClass('open');
                if(does) {
                    menu.toggleClass('dropdown');
                }
                AppManager.execute("set:active:header");
                AppManager.trigger('auth:logout');
            });
            headers.on("childview:navigate", function(childView, model){
                //   console.log(childView);
                  var menu = this.$('div.collapse');
                  var does = menu.hasClass('in');
                  if(does) {
                      menu.collapse('toggle');
                  }
                var trigger = model.get("navigationTrigger");
                AppManager.trigger(trigger,model.get('id'));
            });
            headers.on("language:change", function(lang){
                //console.log(lang);
               // AppManager.trigger('language:changed',lang);
                AppManager.request("language:change", lang);
            });

          AppManager.headerRegion.show(headers);
            AppManager.footerRegion.show(footer);
        });
      },

      setActiveHeader: function(headerUrl){
          console.log('Header Url  '+headerUrl);
          var links = AppManager.request("header:entities");
          var headerToSelect = links.find(function(header){ return  header.get("url") === headerUrl;});
          var headerToDeselect = links.selected;
          if(_.isUndefined(headerToSelect) ){
              _.each(links,function(value){
                  links.deselect(value);
              });
          }else{
              headerToSelect.select();
              links.trigger("reset");
          }
      },
        ResetActiveHeader: function(){
            console.log('hit ResetActiveHeader');
            var user = $('li span.user');
            user.text('User');
            var authUl = $(document.body).find('ul.auth');
            var loginBtn = authUl.find('a.Login');
            var dashboardBtn = authUl.find('a.Dashboard');
            if(dashboardBtn){
                dashboardBtn.text('Login').attr('href','#auth').removeAttr('data-id').removeClass('Dashboard').addClass('Login');
            }
            loginBtn.text('Login').attr('href','#auth').removeClass('Dashboard').removeAttr('data-id').addClass('Login');
            var settingsBtn = authUl.find('a.Settings');
            settingsBtn.parent().remove();
            //$(document.body).find('ul.auth').find('a.Login').text('Login');
           // var logout = $(document.body).find('ul.auth').find('a.Logout');
            var logout = authUl.find('a.Logout');
            if(!logout.hasClass('hidden')){
                logout.toggleClass('hidden');
            }
        },

        setActiveUser: function(username, id){
            console.log('setActive User '+id+' '+ username);//<i class="glyphicon glyphicon-user"></i> User <span class="caret"></span>
         var user = $('li span.user');
            user.text(String(username).toUpperCase());
        //selectors
         var authUl = $(document.body).find('ul.auth');
         var loginBtn = authUl.find('a.Login');
       //change login link to dashboard
         loginBtn.text('Dashboard').attr('href','#dashboard/'+username)
             .attr('data-id',username)
             .removeClass('Login')
             .addClass('Dashboard');
       //add settings link
         var userLink = '<li>'+
             '<a href="#auth/'+id+'"'+
              'class="Settings"'+
              'data-id="'+id+'">'+
              'Settings</a></li>';
         authUl.prepend(userLink);

         var logout = authUl.find('a.Logout');
         if(logout.hasClass('hidden')){
             logout.toggleClass('hidden');
         }
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
            },10000);
      }




    };
  });

  return AppManager.HeaderApp.List.Controller;
});
