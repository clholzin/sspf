define(["app",
        "tpl!apps/auth/show/templates/missing.tpl",
        "tpl!apps/auth/show/templates/view.tpl"],
       function(ContactManager, missingTpl, viewTpl){
  ContactManager.module("AuthApp.Show.View", function(View, ContactManager, Backbone, Marionette, $, _){
    View.Missing = Marionette.ItemView.extend({
      template: missingTpl
    });

    View.Edit = Marionette.ItemView.extend({
          template: viewTpl,

          events: {
              "click a.js-edit": "editClicked"
          },

          editClicked: function(e){
              e.preventDefault();
              this.trigger("auth:edit", this.model);
          }
      });
  });

  return ContactManager.AuthApp.Show.View;
});
