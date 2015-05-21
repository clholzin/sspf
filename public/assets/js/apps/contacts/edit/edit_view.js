define(["app", "apps/contacts/common/views"], function(AppManager, CommonViews){
  AppManager.module("ContactsApp.Edit.View", function(View, AppManager, Backbone, Marionette, $, _){
    View.Contact = CommonViews.Form.extend({
      initialize: function(){
        this.title = "Edit " + this.model.get("username")+" roles";
      },

      onRender: function(){
        if(this.options.generateTitle){
          var $title = $("<h3>", { text: this.title });
          this.$el.prepend($title);
        }

        this.$(".js-submit").text("Update role");
      }
    });
  });

  return AppManager.ContactsApp.Edit.View;
});
