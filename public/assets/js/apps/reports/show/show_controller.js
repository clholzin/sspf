define(["app", "apps/reports/show/show_view"], function (AppManager, View) {
    AppManager.module("ReportsApp.Show", function (Show, AppManager, Backbone, Marionette, $, _) {
        Show.Controller = {
            showReport: function (id) {
                require(["common/views", "entities/contracts"], function (CommonViews) {
                    console.log('id:' + id);
                    var loadingView = new CommonViews.Loading({
                        title: 'Report',
                        message: t("loading.message")
                        //title: t("contact.showContact"),
                        // message: t("loading.message")
                    });
                    AppManager.mainRegion.show(loadingView);


                    var reportView,
                        contractView,
                        TopView,
                        MainLayout,
                        TreeView;

                       MainLayout = new View.Regions();


                    var fetchingReport = AppManager.request("report:entity", id);
                    $.when(fetchingReport).done(function (report) {
                        var contractID = report.attributes.contractId;
                        //console.log(contractID);
                        var fetchingContract = AppManager.request("contract:entity", contractID);
                        $.when(fetchingContract).done(function (contract) {
                            //treeView 'report:tree:entity'
                   if(report != undefined){
                             TopView = new View.Top();
                            //   console.log('Show report:' +JSON.stringify(id));
                            reportView = new View.Report({
                                model: report
                            });
                            reportView.on("report:tree", function (args) {
                             //  var model = args.model;
                                var loadingView = new CommonViews.Loading({
                                    title: 'Hierarchy',
                                    message: t("loading.message")
                                });
                                MainLayout.ReviewPanel.show(loadingView);
                             //var fetchingTree = AppManager.request("report:tree:entity", model.get('contractId'));
                                var fetchingTree = AppManager.request("report:tree:entity", '555a500b46294cc0324389e6');
                               $.when(fetchingTree).done(function (treeModel) {
                                  // var collection = treeModel.get('hier');
                                   //console.log(treeModel);
                                   TreeView = new  View.HeirarchyRoot({
                                       collection:treeModel
                                   });
                                   MainLayout.ReviewPanel.show(TreeView);
                               });
                             });
                            /**reportView.on("report:edit", function (args) {
                                var model = args.model;
                                AppManager.trigger("report:edit", model.get("id"));
                            });**/

                            contractView = new View.Contract({
                                model: contract
                            });
                      } else{
                             reportView = new View.MissingReport();
                            AppManager.mainRegion.show(reportView);
                                }
                            MainLayout.on("show", function () {
                                MainLayout.TopPanel.show(TopView);
                                MainLayout.ReportPanel.show(reportView);
                                MainLayout.ReviewPanel.show(contractView);

                                console.log('hit on show ReportLayout');
                            });

                            AppManager.mainRegion.show(MainLayout);

                        });
                    });
                });
            }
        }
    });

    return AppManager.ReportsApp.Show.Controller;
});
