define(["app", "apps/header/list/list_view"], function(ContactManager, View){
  ContactManager.module("HeaderApp.List", function(List, ContactManager, Backbone, Marionette, $, _){
    List.Controller = {
      listHeader: function(){
        require(["entities/header"], function(){
          var links = ContactManager.request("header:entities");
            //var links = ContactManager.request("login:logout");
            //console.log(links);
          var headers = new View.Headers({collection: links});

          headers.on("brand:clicked", function(){
            ContactManager.trigger("auth:login");
          });
          headers.on("backBtn:clicked", function(childView, model){
            console.log('hit backBtn');
            window.history.back();
          });
          /**headers.on("childview:loginBtn", function(){
              console.log('hit login');
              childView.ui.logout.show();
          });
          headers.on("childview:logoutBtn", function(childView, model){
                console.log('hit logout');
                View.Header.ui.logout.hide();
          });**/
          headers.on("childview:navigate", function(childView, model){
            var trigger = model.get("navigationTrigger");
            ContactManager.trigger(trigger,model.get('id'));
          });

          ContactManager.headerRegion.show(headers);
        });
      },

      setActiveHeader: function(headerUrl){
          console.log('Header Url  '+headerUrl);
        var links = ContactManager.request("header:entities");
          //console.log(JSON.stringify(links));
        var headerToSelect = links.find(function(header){ return header.get("url") === headerUrl; });
        headerToSelect.select();
        links.trigger("reset");
      },
      ResetActiveHeader: function(){
        var links = ContactManager.request("header:entities");
          //console.log(links);
        var headerToReset = links.find(function(header){ return header.get("navigationTrigger") === 'auth:show'; });
          if(headerToReset === undefined){
              return;
          }
          headerToReset.set({name:'Login',url:'auth',navigationTrigger:'auth:login'});
          headerToReset.select();
          links.trigger("reset");
      },
      setActiveUser: function(user){
          console.log('hit setActive User');
          var links = ContactManager.request("header:entities");
          var headerToUser = links.find(function(header){ return header.get("name") === 'Login'; });
          if(headerToUser === undefined){
              return;
          }
          headerToUser.set({name:user.toUpperCase(),url:'auth/'+user,navigationTrigger:'auth:show'});
         // ContactManager.execute("set:active:header", "auth:show");
          links.trigger("reset");
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
                    this.empty();
                });
            },5000);
      }




    };
  });

  return ContactManager.HeaderApp.List.Controller;
});
