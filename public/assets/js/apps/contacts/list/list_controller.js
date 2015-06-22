define(["app", "apps/contacts/list/list_view"], function(AppManager, View){
  AppManager.module("ContactsApp.List", function(List, AppManager, Backbone, Marionette, $, _){
    List.Controller = {
      listContacts: function(criterion){
        require(["common/views", "entities/contact"], function(CommonViews){
          /**var loadingView = new CommonViews.Loading();
            AppManager.loadingRegion.show(loadingView);**/
          var fetchingContacts = AppManager.request("contact:entities");

          var contactsListLayout = new View.Layout();
          var contactsListPanel = new View.Panel();

          require(["entities/common"], function(FilteredCollection){
            $.when(fetchingContacts).done(function(contacts){
              var filteredContacts = AppManager.Entities.FilteredCollection({
                collection: contacts,
                filterFunction: function(filterCriterion){
                  var criterion = filterCriterion.toLowerCase();
                  return function(contact){
                    if(contact.get('username').toLowerCase().indexOf(criterion) !== -1
                      || contact.get('roles').indexOf(criterion) !== -1
                    ){
                        return contact;
                    }
                  };
                }
              });

              if(criterion){
                filteredContacts.filter(criterion);
                contactsListPanel.once("show", function(){
                  contactsListPanel.triggerMethod("set:filter:criterion", criterion);
                });
              }


                var HeaderView = new CommonViews.Header({
                    title : "Registered Users"
                });

                HeaderView.on('header:back',function(){
                    loadingView = new CommonViews.Loading({
                        title: "",
                        message: ""
                    });
                    AppManager.loadingRegion.show(loadingView);
                    var fetchingUser = AppManager.request("login:entity");
                    $.when(fetchingUser).done(function(loginUser) {
                        if (loginUser.attributes.loggedIn === 1) {
                            AppManager.trigger('auth:dashboard', loginUser.get('username'));
                        }else{
                            AppManager.trigger('auth:login');
                        }
                    });
                });




              var contactsListView = new View.Contacts({
                collection: filteredContacts
              });

              contactsListPanel.on("contacts:filter", function(filterCriterion){
                filteredContacts.filter(filterCriterion);
                AppManager.trigger("contacts:filter", filterCriterion);
              });

              contactsListLayout.on("show", function(){
                contactsListLayout.headerPanel.show(HeaderView);
                contactsListLayout.menuPanel.show(contactsListPanel);
                contactsListLayout.contactsPanel.show(contactsListView);
              });

                contactsListPanel.on("contact:new", function(){
                    require(["apps/contacts/new/new_view","entities/auth"], function(NewView){
                        var view = new NewView.Contact();
                        view.on("form:submit", function(data){

                            var newContact = AppManager.request("login:entity:new");
                              var saveCheck =  newContact.save(data,{wait:true,
                                    success:function(model,response){
                                        if(response.info){
                                            AppManager.triggerMethod("form:data:invalid", model.validationError);
                                            AppManager.execute("alert:show",({type:"warning",message:response.info}));
                                        }
                                       // contacts.add(model,{at:0});
                                        contacts.fetch();
                                       // console.log(contacts.models.attributes);
                                        view.trigger("dialog:close");
                                        //compView.children.findByModel(collection.get({id: elId}))
                                        var findModel = contacts.findWhere({'username':response.username});
                                        var display = contacts.at(findModel);
                                        console.log(JSON.stringify(display));
                                        var newContactView = contactsListView.children.findByModel(display);
                                        newContactView.flash("bg-success animated fadeIn");
                                        AppManager.execute("alert:show",({type:"success",message:'Added: '+ model.get('username')}));
                                        //contacts.fetch();
                                    },
                                    error: function (model, response) {
                                        console.log(JSON.stringify(response));
                                        if(response.statusText !== null || undefined){
                                            AppManager.triggerMethod("form:data:invalid", model.validationError);
                                            AppManager.execute("alert:show",({type:"warning",message:JSON.stringify(response.info)}));
                                        }
                                        //alert(JSON.stringify(response.statusText));
                                    }
                                });

                                if (!saveCheck) {
                                    view.triggerMethod("form:data:invalid", newContact.validationError);
                                }


                        });

                        AppManager.dialogRegion.show(view);
                    });
                });

              contactsListView.on("childview:contact:show", function(childView, args){
                  console.log(args.model.get("_id"));
                AppManager.trigger("contact:show", args.model.get("_id"));
              });

              contactsListView.on("childview:contact:edit", function(childView, args){
                require(["apps/contacts/edit/edit_view"], function(EditView){
                  var model = args.model;
                  var view = new EditView.Contact({
                    model: model
                  });

                  view.on("form:submit", function(data){
                      console.log('roles submitte data event: '+ JSON.stringify(data));
                    if(model.save({roles:data},{wait:true})){
                         //  console.log(view);
                        model.set({roles:data});
                        //view.triggerMethod("initialize");
                        childView.render();
                            AppManager.execute("alert:show",({type:"success",message:"Roles Saved!!!"}));
                            view.trigger("dialog:close");
                            childView.flash("success");
                    }
                    else{
                        AppManager.execute("alert:show",({type:"danger",message:"Error trying to update."}));
                      view.triggerMethod("form:data:invalid", model.validationError);
                    }
                  });
                  AppManager.dialogRegion.show(view);
                });
              });

              contactsListView.on("childview:contact:delete", function(childView, args){
                  console.log(args.model.get('_id'));
                    if(confirm('Are you sure you want to Delete')){
                        //contact:
                        args.model.destroy();
                        AppManager.execute("alert:show",({type:"success",message:'Deleted '+args.model.attributes.username}));
                        /**args.model.destroy({
                            success: function(model, response) {
                                console.log(JSON.stringify(response));
                                    //if(response.statusText === 200){
                                        AppManager.execute("alert:show",({type:"success",message:JSON.stringify(response)}));
                                   // }else{
                                   //     AppManager.execute("alert:show",({type:"danger",message:JSON.stringify(response)}));
                                   // }
                                }
                        });**/
                    }

              });

              AppManager.mainRegion.show(contactsListLayout);
                AppManager.loadingRegion.empty();
            });
          });
        });
      }
    }
  });

  return AppManager.ContactsApp.List.Controller;
});


