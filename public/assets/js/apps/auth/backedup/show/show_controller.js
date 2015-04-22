define(["app", "apps/auth/show/show_view"], function(ContactManager, View){
  ContactManager.module("AuthApp.Show", function(Show, ContactManager, Backbone, Marionette, $, _){
    Show.Controller = {
      showUser: function(id){
        require(["common/views", "entities/auth"], function(CommonViews){
          var loadingView = new CommonViews.Loading({
            title: "Artificial Loading Delay",
            message: "Data loading is delayed to demonstrate using a loading view."
          });
          ContactManager.mainRegion.show(loadingView);

          var fetchingUser = ContactManager.request("login:entity", id);
          $.when(fetchingUser).done(function(user){
            var authView;
            if(user !== undefined){
                authView = new View.Login({
                model: user
              });

                authView.on("auth:edit", function(user){
                ContactManager.trigger("auth:edit", user.get("id"));
              });
            }
            else{
                authView = new View.MissingContact();
            }

            ContactManager.mainRegion.show(authView);
          });
        });
      }
    }
  });

  return ContactManager.AuthApp.Show.Controller;
});
