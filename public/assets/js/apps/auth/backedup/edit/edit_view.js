define(["app", "apps/auth/common/views"], function(ContactManager, CommonViews){
  ContactManager.module("AuthApp.Edit.View", function(View, ContactManager, Backbone, Marionette, $, _){
    View.Edit = CommonViews.Form.extend({
      initialize: function(){
        this.title = "Edit: " + this.model.get("userName");
      },

      onRender: function(){
        if(this.options.generateTitle){
          var $title = $("<h1>", { text: this.title });
          this.$el.prepend($title);
        }

        this.$(".js-submit").text("Update contact");
      }
    });
  });

  return ContactManager.AuthApp.Edit.View;
});
