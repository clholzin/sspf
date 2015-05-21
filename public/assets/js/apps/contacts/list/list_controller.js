define(["app", "apps/contacts/list/list_view"], function(AppManager, View){
  AppManager.module("ContactsApp.List", function(List, AppManager, Backbone, Marionette, $, _){
    List.Controller = {
      listContacts: function(criterion){
        require(["common/views", "entities/contact"], function(CommonViews){
          var loadingView = new CommonViews.Loading();
          AppManager.mainRegion.show(loadingView);

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

              var contactsListView = new View.Contacts({
                collection: filteredContacts
              });

              contactsListPanel.on("contacts:filter", function(filterCriterion){
                filteredContacts.filter(filterCriterion);
                AppManager.trigger("contacts:filter", filterCriterion);
              });

              contactsListLayout.on("show", function(){
                contactsListLayout.panelRegion.show(contactsListPanel);
                contactsListLayout.contactsRegion.show(contactsListView);
              });

              contactsListPanel.on("contact:new", function(){
                  require(["apps/contacts/new/new_view"], function(NewView){
                  var view = new NewView.Contact();
                  view.on("form:submit", function(data){
                      var newContact = AppManager.request("login:entity:new");
                      $.when(newContact).done(function(newUser){
                      console.log('hit contact:new'+ JSON.stringify(data));
                          var saved = newUser.save(data,{
                          success:function(model,response){
                              if(response.info !== null || undefined){
                                  AppManager.triggerMethod("form:data:invalid", newUser.validationError);
                                  AppManager.execute("alert:show",({type:"warning",message:response.info}));
                              }
                              if(model.length > 0){
                                  //var highestId = _.max(contacts,function(contact){ return contact._id; }).get("id");
                                  model.id = 2;
                              }
                              else{
                                  model.id = 1;
                              }
                              contacts.add(model);
                              view.model = model;
                              view.trigger("dialog:close");
                              var newContactView = contactsListView.children.findByModel(model);
                              if(newContactView){
                                  newContactView.flash("bg-success animated fadeIn");
                                  AppManager.execute("alert:show",({type:"success",message:'Added: '+ model.get('username')}));
                              }else{
                                  AppManager.triggerMethod("form:data:invalid", newUser.validationError);
                              }
                          },
                          error: function (model, response) {
                              console.log(JSON.stringify(response));
                              if(response.statusText !== null || undefined){
                                  AppManager.triggerMethod("form:data:invalid", newUser.validationError);
                                  AppManager.execute("alert:show",({type:"warning",message:JSON.stringify(response.info)}));
                              }
                              //alert(JSON.stringify(response.statusText));
                          }
                      });

                          if(! saved){
                              view.triggerMethod("form:data:invalid", newUser.validationError);
                          }
                 /**  if(newUser.save(data)){
                      contacts.add(newUser);
                        view.model = newUser;
                      view.trigger("dialog:close");
                      var newContactView = contactsListView.children.findByModel(newUser);
                      // check whether the new contact view is displayed (it could be
                      // invisible due to the current filter criterion)
                      if(newContactView){
                        newContactView.flash("bg-success animated fadeIn");
                      }
                    }
                    else{
                      view.triggerMethod("form:data:invalid", newUser.validationError);
                    }**/
                      });
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
            });
          });
        });
      }
    }
  });

  return AppManager.ContactsApp.List.Controller;
});


