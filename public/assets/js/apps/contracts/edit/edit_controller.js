define(["app", "apps/contracts/edit/edit_view"], function(AppManager, View){
    AppManager.module("ContractsApp.Edit", function(Edit, AppManager, Backbone, Marionette, $, _){
        Edit.Controller = {
            editContract: function(id){
                require(["common/views", "entities/contract"], function(CommonViews){
                    var loadingView = new CommonViews.Loading({
                        title: "Edit Data",
                        message: "Loading"
                    });
                    AppManager.mainRegion.show(loadingView);

                    var fetchingContract = AppManager.request("contract:entity", id);
                    $.when(fetchingContract).done(function(contract){
                        var view;
                        if(contract !== undefined){
                            view = new View.Contract({
                                model: contract,
                                generateTitle: true
                            });

                            view.on("form:submit", function(data){
                                if(contract.save(data)){
                                    AppManager.trigger("contract:show", contract.get('_id'));
                                }
                                else{
                                    view.triggerMethod("form:data:invalid", contact.validationError);
                                }
                            });
                        }
                        else{
                            view = new AppManager.ContractsApp.Show.MissingContact();
                        }

                        AppManager.mainRegion.show(view);
                    });
                });
            }
        };
    });

    return AppManager.ContractsApp.Edit.Controller;
});
