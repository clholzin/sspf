define(["app", "apps/reports/common/views"], function(AppManager, CommonViews){
  AppManager.module("ReportsApp.Edit.View", function(View, AppManager, Backbone, Marionette, $, _){
    View.Report = CommonViews.Form.extend({
      initialize: function(){
        this.title = "Edit " + this.model.get("username")+" roles";
      },

      onRender: function(){
        if(this.options.generateTitle){
          var $title = $("<h3>", { text: this.title });
          this.$el.prepend($title);
        }

        this.$(".js-submit").text("Edit Report");
      }
    });
  });

  return AppManager.ReportsApp.Edit.View;
});
