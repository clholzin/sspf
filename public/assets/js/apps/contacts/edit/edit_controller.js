define(["app", "apps/contacts/edit/edit_view"], function(AppManager, View){
  AppManager.module("ContactsApp.Edit", function(Edit, AppManager, Backbone, Marionette, $, _){
    Edit.Controller = {
      editContact: function(id){
        require(["common/views", "entities/contact"], function(CommonViews){
          var loadingView = new CommonViews.Loading({
            title: "Edit Data",
            message: "Loading"
          });
          AppManager.mainRegion.show(loadingView);

          var fetchingContact = AppManager.request("contact:entity", id);
          $.when(fetchingContact).done(function(contact){
            var view;
            if(contact !== undefined){
              view = new View.Contact({
                model: contact,
                generateTitle: true
              });

              view.on("form:submit", function(data){
                if(contact.save(data)){
                  AppManager.trigger("contact:show", contact.get('_id'));
                }
                else{
                  view.triggerMethod("form:data:invalid", contact.validationError);
                }
              });
            }
            else{
              view = new AppManager.ContactsApp.Show.MissingContact();
            }

            AppManager.mainRegion.show(view);
          });
        });
      }
    };
  });

  return AppManager.ContactsApp.Edit.Controller;
});
