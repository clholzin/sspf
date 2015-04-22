define(["app", "apps/auth/edit/edit_view"], function(ContactManager, View){
  ContactManager.module("AuthApp.Edit", function(Edit, ContactManager, Backbone, Marionette, $, _){
    Edit.Controller = {
        editLogins: function(id){
        require(["common/views", "entities/auth"], function(CommonViews){
          var loadingView = new CommonViews.Loading({
            title: "Artificial Loading Delay",
            message: "Data loading is delayed to demonstrate using a loading view."
          });
          ContactManager.mainRegion.show(loadingView);

          var fetchingUser = ContactManager.request("login:entity", id);
          $.when(fetchingUser).done(function(user){
            var view;
            if(user !== undefined){
              view = new View.Login({
                model: user,
                generateTitle: true
              });

              view.on("form:submit", function(data){
                if(user.save(data)){
                  ContactManager.trigger("auth:show", user.get('id'));
                }
                else{
                  view.triggerMethod("form:data:invalid", user.validationError);
                }
              });
            }
            else{
              view = new ContactManager.ContactsApp.Show.MissingContact();
            }

            ContactManager.mainRegion.show(view);
          });
        });
      }
    };
  });

  return ContactManager.AuthApp.Edit.Controller;
});
