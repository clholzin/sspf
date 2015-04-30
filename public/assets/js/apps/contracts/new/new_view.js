define(["app", "apps/contracts/common/views"], function(AppManager, CommonViews){
    AppManager.module("ContractsApp.New.View", function(View, AppManager, Backbone, Marionette, $, _){
        View.Contract = CommonViews.Form.extend({
            title: "New Contract",

            onRender: function(){
                this.$(".js-submit").text("Create");
            }
        });
    });

    return AppManager.ContractsApp.New.View;
});
