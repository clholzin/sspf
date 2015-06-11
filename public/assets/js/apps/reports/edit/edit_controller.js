define(["app", "apps/reports/edit/edit_view"], function(AppManager, View){
  AppManager.module("ReportsApp.Edit", function(Edit, AppManager, Backbone, Marionette, $, _){
    Edit.Controller = {
      editReport: function(id){
        require(["common/views", "entities/contact"], function(CommonViews){
          var loadingView = new CommonViews.Loading({
            title: "Edit Report",
            message: "Loading"
          });
          AppManager.mainRegion.show(loadingView);

          var fetchingContact = AppManager.request("contact:entity", id);
          $.when(fetchingContact).done(function(contact){
            var view;
            if(contact !== undefined){
              view = new View.Report({
                model: contact,
                generateTitle: true
              });

              view.on("form:submit", function(data){
                if(contact.save(data)){
                  AppManager.trigger("report:show", contact.get('_id'));
                }
                else{
                  view.triggerMethod("form:data:invalid", contact.validationError);
                }
              });
            }
            else{
              view = new AppManager.ReportsApp.Show.MissingContact();
            }

            AppManager.mainRegion.show(view);
          });
        });
      }
    };
  });

  return AppManager.ReportsApp.Edit.Controller;
});
