define(["app", "apps/contacts/show/show_view"], function(AppManager, View){
    AppManager.module("ContractsApp.Show", function(Show, AppManager, Backbone, Marionette, $, _){
        Show.Controller = {
            showContract: function(id){
                require(["common/views", "entities/contract"], function(CommonViews){
                    var loadingView = new CommonViews.Loading({
                        title: "Showing",
                        message: "Loading..."
                    });
                    AppManager.mainRegion.show(loadingView);

                    var fetchingContract = AppManager.request("contract:entity", id);
                    $.when(fetchingContract).done(function(contact){
                        console.log('Show Contact:' +JSON.stringify(contract));
                        var contractView;
                        if(contract != undefined){
                            contractView = new View.Contract({
                                model: contract
                            });

                            contractView.on("contract:edit", function(contract){
                                AppManager.trigger("contract:edit", contract.get("_id"));
                            });
                        }
                        else{
                            contractView = new View.MissingContract();
                        }

                        AppManager.mainRegion.show(contractView);
                    });
                });
            }
        }
    });

    return AppManager.ContractsApp.Show.Controller;
});
