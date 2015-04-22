define(["app", "apps/auth/list/list_view"], function(ContactManager, View){
  ContactManager.module("AuthApp.List", function(List, ContactManager, Backbone, Marionette, $, _){
    List.Controller = {
        listUsers: function(criterion){
        require(["common/views", "entities/auth"], function(CommonViews){
          var loadingView = new CommonViews.Loading();
          ContactManager.mainRegion.show(loadingView);

          var fetchingusers = ContactManager.request("login:entities");

          var usersListLayout = new View.Layout();
          var usersListPanel = new View.Panel();

          require(["entities/common"], function(FilteredCollection){
              var fetchingusers = ContactManager.request("login:entities");
            $.when(fetchingusers).done(function(users){




                usersListPanel.on("auth:login", function(){
                    require(["apps/auth/login/login_view"], function(LoginView){
                        var loginUser = ContactManager.request("login:entity");

                        var view = new LoginView.Login({
                            model: loginUser
                        });
                        view.on("form:submit", function(data){

                            if(loginUser.save(data)){
                                loginUser.add(loginUser);
                                view.trigger("dialog:close");
                                var newUserView =  usersListView.children.findByModel(loginUser);
                                // check whether the new contact view is displayed (it could be
                                // invisible due to the current filter criterion)
                                if(newUserView){
                                    newUserView.flash("success");
                                    ContactManager.trigger("auth:show", loginUser.model.get("id"));
                                }
                            }
                            else{
                                view.triggerMethod("form:data:invalid", newUserView.validationError);
                            }
                        });

                    });
                });
              usersListPanel.on("auth:new", function(){
                require(["apps/auth/new/new_view"], function(NewView){
                  var newUser = ContactManager.request("login:entity:new");

                  var view = new NewView.Register({
                    model: newUser
                  });

                  view.on("form:submit", function(data){
                    if(users.length > 0){
                      var highestId = users.max(function(c){ return c.id; }).get("id");
                      data.id = highestId + 1;
                    }
                    else{
                      data.id = 1;
                    }
                    if(newUser.save(data)){
                      users.add(newUser);
                      view.trigger("dialog:close");
                      var newUserView =  usersListView.children.findByModel(newUser);
                      // check whether the new contact view is displayed (it could be
                      // invisible due to the current filter criterion)
                      if(newUserView){
                          newUserView.flash("success");

                      }
                    }
                    else{
                      view.triggerMethod("form:data:invalid", newUserView.validationError);
                    }
                  });

                  ContactManager.dialogRegion.show(view);
                });
              });

                usersListView.on("childview:auth:show", function(childView, args){
                ContactManager.trigger("auth:show", args.model.get("id"));
              });

                usersListView.on("childview:auth:edit", function(childView, args){
                require(["apps/auth/edit/edit_view"], function(EditView){
                  var model = args.model;
                  var view = new EditView.Edit({
                    model: model
                  });

                  view.on("form:submit", function(data){
                    if(model.save(data)){
                      childView.render();
                      view.trigger("dialog:close");
                      childView.flash("success");
                    }
                    else{
                      view.triggerMethod("form:data:invalid", model.validationError);
                    }
                  });

                  ContactManager.dialogRegion.show(view);
                });
              });

                usersListView.on("childview:auth:delete", function(childView, args){
                args.model.destroy();
              });

              ContactManager.mainRegion.show(usersListLayout);
            });
          });
        });
      }
    }
  });

  return ContactManager.AuthApp.List.Controller;
});
