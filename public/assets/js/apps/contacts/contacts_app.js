define(["app"], function(AppManager){
  AppManager.module("ContactsApp", function(ContactsApp, AppManager, Backbone, Marionette, $, _){
    ContactsApp.startWithParent = false;

    ContactsApp.onStart = function(){
      console.log("starting ContactsApp");
    };

    ContactsApp.onStop = function(){
      console.log("stopping ContactsApp");
    };
  });

  AppManager.module("Routers.ContactsApp", function(ContactsAppRouter, AppManager, Backbone, Marionette, $, _){
    ContactsAppRouter.Router = Marionette.AppRouter.extend({
      appRoutes: {
        ":lang/contacts(/filter/criterion::criterion)": "listContacts",
        ":lang/contacts/:id": "showContact",
        ":lang/contacts/:id/edit": "editContact"
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

    var executeAction = function(action, arg,lang){
       // console.log('Check ContactsApp for login '+JSON.stringify(AppManager.user));
            if (AppManager.user.loggedIn === 0 || undefined) {
                AppManager.trigger('auth:login');
                AppManager.execute("alert:show", {type: "warning", message: "Must be logged in."});
            } else {
                AppManager.startSubApp("ContactsApp");
                action(arg);
                AppManager.execute("set:active:header", "contacts");
            }
    };

    var API = {
      listContacts: function(criterion){
        require(["apps/contacts/list/list_controller"], function(ListController){
          executeAction(ListController.listContacts, criterion);
        });
      },

      showContact: function(id){
        require(["apps/contacts/show/show_controller"], function(ShowController){
          executeAction(ShowController.showContact, id);
        });
      },

      editContact: function(id){
        require(["apps/contacts/edit/edit_controller"], function(EditController){
          executeAction(EditController.editContact, id);
        });
      }
    };

    AppManager.on("contacts:list", function(){
      AppManager.navigate("contacts");
      API.listContacts();
    });

    AppManager.on("contacts:filter", function(criterion){
      if(criterion){
        AppManager.navigate("contacts/filter/criterion:" + criterion);
      }
      else{
        AppManager.navigate("contacts");
      }
    });

    AppManager.on("contact:show", function(id){
      AppManager.navigate("contacts/" + id);
      API.showContact(id);
    });

    AppManager.on("contact:edit", function(id){
      AppManager.navigate("contacts/" + id + "/edit");
      API.editContact(id);
    });

    AppManager.addInitializer(function(){
      new ContactsAppRouter.Router({
        controller: API
      });
    });
  });

  return AppManager.ContactsAppRouter;
});
