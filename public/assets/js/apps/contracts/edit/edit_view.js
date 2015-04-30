define(["app", "apps/contracts/common/views"], function(AppManager, CommonViews){
    AppManager.module("ContractsApp.Edit.View", function(View, AppManager, Backbone, Marionette, $, _){
        View.Contract = CommonViews.Form.extend({
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

    return AppManager.ContractsApp.Edit.View;
});
