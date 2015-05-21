define(["app", "apps/contracts/common/views","vendor/moment"], function(AppManager, CommonViews,Moment){
    AppManager.module("ContractsApp.New.View", function(View, AppManager, Backbone, Marionette, $, _){
        View.Contract = CommonViews.Form.extend({

            initialize: function(){
                this.title = "New Contract:";
            },
            templateHelpers:function(){
                return {
                    updated_at: Moment().format('YYYY-MM-DD, h:mm:ss a'),
                   date_created: Moment().format('YYYY-MM-DD, h:mm:ss a')
                }
            },
            onRender: function(){
                this.$(".js-submit").text("Create");
            }
        });
    });

    return AppManager.ContractsApp.New.View;
});
