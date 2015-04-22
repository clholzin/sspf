define(["app", "apps/auth/common/views"], function(ContactManager, CommonViews){
  ContactManager.module("Authpp.New.View", function(View, ContactManager, Backbone, Marionette, $, _){
    View.Register = CommonViews.Form.extend({
      title: "Register",

      onRender: function(){
        this.$(".js-submit").text("Register");
      }
    });
  });

  return ContactManager.Authpp.New.View;
});
