define(["app", "apps/contacts/show/show_view"], function(AppManager, View){
  AppManager.module("ContactsApp.Show", function(Show, AppManager, Backbone, Marionette, $, _){
    Show.Controller = {
      showContact: function(id){
        require(["common/views", "entities/contact"], function(CommonViews){
          var loadingView = new CommonViews.Loading({
            title: t("contact.showContact"),
            message: t("loading.message")
          });
            AppManager.loadingRegion.show(loadingView);

          var fetchingContact = AppManager.request("contact:entity", id);
          $.when(fetchingContact).done(function(contact){
           //   console.log('Show Contact:' +JSON.stringify(contact));
            var contactView;
            if(contact != undefined){
              contactView = new View.Contact({
                model: contact
              });

              contactView.on("contact:edit", function(contact){
                AppManager.trigger("contact:edit", contact.get("id"));
              });
            }
            else{
              contactView = new View.MissingContact();
            }

            AppManager.mainRegion.show(contactView);
              AppManager.loadingRegion.empty();
          });
        });
      }
    }
  });

  return AppManager.ContactsApp.Show.Controller;
});
