define(["app",
        "tpl!apps/contracts/show/templates/missing.tpl",
        "tpl!apps/contracts/show/templates/view.tpl"],
    function(AppManager, missingTpl, viewTpl){
        AppManager.module("ContractsApp.Show.View", function(View, AppManager, Backbone, Marionette, $, _){
            View.MissingContract = Marionette.ItemView.extend({
                template: missingTpl
            });

            View.Contract = Marionette.ItemView.extend({
                template: viewTpl,

                events: {
                    "click a.js-edit": "editClicked"
                },

                editClicked: function(e){
                    e.preventDefault();
                    this.trigger("contract:edit", this.model);
                }
            });
        });

        return AppManager.ContractsApp.Show.View;
    });
