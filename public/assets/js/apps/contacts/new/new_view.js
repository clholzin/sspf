define(["app", "apps/contacts/common/views"], function(AppManager, CommonViews){
  AppManager.module("ContactsApp.New.View", function(View, AppManager, Backbone, Marionette, $, _){
    View.Contact = CommonViews.CreateUser.extend({
     // title: "Login",
        initialize: function(){
            this.title = "Register ";
        },
        templateHelpers:function(){
            return {
                title:this.title
            }
        },
      onRender: function(){
          if(this.options.generateTitle){
              var $title = $("<h3>", { text: this.title });
              this.$el.prepend($title);
          }
        this.$(".js-submit").hide();
          this.$(".js-register").text("Create contact");
      }
    });
  });

  return AppManager.ContactsApp.New.View;
});
