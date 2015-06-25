define(["app", "apps/reports/show/show_view", "vendor/kendoUI/kendo.all.min"], function (AppManager, View) {
    AppManager.module("ReportsApp.Show", function (Show, AppManager, Backbone, Marionette, $, _) {
        Show.Controller = {
            showReport: function (id) {
                require(["common/views", "entities/contracts","entities/auth", "entities/gateway"], function (CommonViews) {
                    console.log('id:' + id);
                    var loadingView = new CommonViews.Loading({
                        title: 'Report',
                        message: t("loading.message")
                        //title: t("contact.showContact"),
                        // message: t("loading.message")
                    });
                    AppManager.loadingRegion.show(loadingView);


                    FooterView = new CommonViews.Footer();
                    AppManager.footerRegion.show(FooterView);

                    var ReportView,
                        view,
                        Menu,
                        TopView,
                        MainLayout,
                        costSetView,
                        TreeView,
                        FooterView,
                        HeaderView,
                        ContractDetails,
                        ReportingPlan, ContractReport, PricePlan, ActualForecast, MilestonesReview;

                    MainLayout = new View.Regions();


                    var fetchingReport = AppManager.request("report:entity", id);
                    $.when(fetchingReport).done(function (report) {
                        var contractID = report.attributes.contractId;
                        //console.log(contractID);
                        var fetchingContract = AppManager.request("contract:entity", contractID);
                        $.when(fetchingContract).done(function (contract) {
                            //treeView 'report:tree:entity'
                            if (report != undefined) {


                                /**
                                 *
                                 * @type {View.Top}
                                 */
                                TopView = new View.Top();

                                HeaderView = new CommonViews.Header({
                                    title : "Create Report"
                                });

                                HeaderView.on('header:back',function(){
                                    loadingView = new CommonViews.Loading({
                                        title: "",
                                        message: ""
                                    });
                                    AppManager.loadingRegion.show(loadingView);
                                    var fetchingUser = AppManager.request("login:entity");
                                    $.when(fetchingUser).done(function(loginUser) {
                                        if (loginUser.attributes.loggedIn === 1) {
                                            AppManager.trigger('auth:dashboard', loginUser.get('username'));
                                        }else{
                                            AppManager.trigger('auth:login');
                                        }
                                    });
                                });

                                /**
                                 *
                                 * @type {View.Footer}
                                 */
                                FooterView = new View.Footer();


                                /**
                                 *
                                 * @type {View.Menu}
                                 */
                                Menu = new View.Menu({
                                    model: report
                                });
                                 ReportingPlan = new View.ReportingPlan({});
                                 ContractReport = new View.ContractReport({});
                                 PricePlan = new View.PricePlan({});
                                 ActualForecast = new View.ActualForecast({});
                                 MilestonesReview = new View.MilestonesReview({});
                               Menu.on('toggle:complete',function(id,value,model){
                                   model.save({"completed":{"_id":id,"checked":value}});
                               });
                               Menu.on('open:0',function(){
                                   ReportingPlan = new View.ReportingPlan({});
                                   ReportingPlan.on('menu:back',function(){
                                       MainLayout.ChildView.reset();
                                   });
                                   MainLayout.ChildView.show(ReportingPlan);
                               });
                                Menu.on('open:1',function(){
                                    ContractReport = new View.ContractReport({});
                                    ContractReport.on('menu:back',function(){
                                        MainLayout.ChildView.reset();
                                    });
                                    MainLayout.ChildView.show(ContractReport);
                                });
                                Menu.on('open:2',function(){
                                    PricePlan = new View.PricePlan({});
                                    PricePlan.on('menu:back',function(){
                                        MainLayout.ChildView.reset();
                                    });
                                    MainLayout.ChildView.show(PricePlan);
                                });
                                Menu.on('open:3',function(){
                                    ActualForecast = new View.ActualForecast({});
                                    ActualForecast.on('menu:back',function(){
                                        MainLayout.ChildView.reset();
                                    });
                                    MainLayout.ChildView.show(ActualForecast);
                                });
                                Menu.on('open:4',function(){
                                    MilestonesReview = new View.MilestonesReview({});
                                    MilestonesReview.on('menu:back',function(){
                                        MainLayout.ChildView.reset();
                                    });
                                    MainLayout.ChildView.show(MilestonesReview);
                                });


                                /**
                                 *
                                 * @type {View.ContractDetails}
                                 */
                                ContractDetails = new View.ContractDetails({
                                    model: contract
                                });



                                /**
                                 *
                                 * @type {View.Report}
                                 */
                                ReportView = new View.Report({
                                    model: report
                                });


                                ReportView.on("report:tree", function (model) {
                                    // var model = args.model;
                                    var loadingView = new CommonViews.Loading({
                                        title: 'Hierarchy',
                                        message: t("loading.message")
                                    });
                                    AppManager.loadingRegion.show(loadingView);
                                    //var fetchingTree = AppManager.request("report:tree:entity", model.get('contractId'));
                                    var project = contract.get('project');
                                    console.log('project id: ' + JSON.stringify(project));
                                    if (_.isString(project.id)) {
                                        var fetchingTree = AppManager.request("report:tree:entity", project.id);
                                        $.when(fetchingTree).done(function (treeModel) {
                                            // var collection = treeModel.get('hier');
                                            console.log(JSON.stringify(treeModel));
                                            TreeView = new View.HeirarchyRoot({
                                                collection: treeModel
                                            });
                                            MainLayout.HierPanel.show(TreeView);
                                            AppManager.loadingRegion.empty();
                                            var hierPanel = $(document.body).find('#hier-panel');
                                            if (hierPanel.hasClass('hidden')) {
                                                hierPanel.toggleClass('hidden');
                                            }
                                            _.debounce(hierPanel.kendoTreeView(), 200);

                                        });
                                    } else {
                                        alert('No project found.');
                                    }

                                });
                                /**ReportView.on("report:edit", function (args) {
                                var model = args.model;
                                AppManager.trigger("report:edit", model.get("id"));
                            });**/



                                ReportView.on("report:guidSet", function () {
                                    var view = new CommonViews.Loading({
                                        title: "",
                                        message: ""
                                        /**  title: "Project List",
                                         message: "Loading..."**/
                                    });
                                    AppManager.loadingRegion.show(view);
                                    var id = '5';
                                    var fetchingGuidSets = AppManager.request("guidSet:entities", id);

                                    $.when(fetchingGuidSets).done(function (guidSet) {
                                        view = new View.GuidSet({
                                            collection: guidSet
                                        });

                                        view.on("report:runid", function () {
                                            var view = new CommonViews.Loading({
                                                title: "",
                                                message: ""
                                                /**  title: "Project List",
                                                 message: "Loading..."**/
                                            });
                                            AppManager.loadingRegion.show(view);
                                            var Runid = '2';
                                            var fetchingGuidSets = AppManager.request("guidSet:entities", Runid);
                                            $.when(fetchingGuidSets).done(function (guidSet) {
                                                var runId = new View.GuidSet({
                                                    collection: guidSet
                                                });
                                                //  AppManager.dialogRegion.show(costSetView);
                                                AppManager.dialogRegion.show(runId);
                                                AppManager.loadingRegion.empty();
                                            });
                                        });

                                        view.on("report:costValueSet", function () {
                                            var view = new CommonViews.Loading({
                                                title: "",
                                                message: ""
                                                /**  title: "Cost Values List",
                                                 message: "Loading..."**/
                                            });
                                            AppManager.loadingRegion.show(view);
                                            var rid = 'E50A16DF5DE960F18482005056A46058';
                                            console.log('trigger: ' + rid);
                                            var fetchingCostSets = AppManager.request("costSet:entities", rid);
                                            $.when(fetchingCostSets).done(function (costSet) {
                                                //    console.log('costs: '+ JSON.stringify(costSet.models));
                                                costSetView = new View.CostValueView({
                                                    collection: costSet
                                                });
                                                //  AppManager.dialogRegion.show(costSetView);
                                                AppManager.dialogRegion.show(costSetView);
                                                AppManager.loadingRegion.empty();
                                            });
                                        });

                                        view.on("report:dpsSet", function (did) {
                                            var view = new CommonViews.Loading({
                                                title: "",
                                                message: ""
                                                /** title: "MOD Project Structure",
                                                 message: "Loading..."**/
                                            });
                                            AppManager.loadingRegion.show(view);
                                            console.log('trigger: ' + id);
                                            var fetchingDpsSets = AppManager.request("dpsSet:entities", did);
                                            $.when(fetchingDpsSets).done(function (dpsSet) {
                                                var dpsset = new View.DpsSet({
                                                    collection: dpsSet
                                                });

                                                AppManager.dialogRegion.show(dpsset);//dpsSet View
                                                AppManager.loadingRegion.empty();
                                            });
                                        });

                                        view.on("report:HierSet", function (pid) {
                                            var view = new CommonViews.Loading({
                                                title: "",
                                                message: ""
                                                /**    title: "Alternative Heirarchy List",
                                                 message: "Loading..."**/
                                            });
                                            AppManager.loadingRegion.show(view);
                                            console.log('trigger: ' + id);
                                            var fetchingHierSet = AppManager.request("hierSet:entities", pid);
                                            $.when(fetchingHierSet).done(function (hierData) {
                                                var hierSet = new View.HierSet({
                                                    collection: hierData
                                                });
                                                hierSet.on("report:dpsSet", function (did) {
                                                    var view = new CommonViews.Loading({
                                                        title: "MOD Project Structure",
                                                        message: "Loading..."
                                                    });
                                                    AppManager.loadingRegion.show(view);
                                                    console.log('trigger: ' + id);
                                                    var fetchingDpsSets = AppManager.request("dpsSet:entities", did);
                                                    $.when(fetchingDpsSets).done(function (dpsData) {
                                                        var dpsset = new View.DpsSet({
                                                            collection: dpsData
                                                        });
                                                        AppManager.loadingRegion.empty();
                                                        AppManager.dialogRegion.show(dpsset);//dpsSet View
                                                    });
                                                });
                                                AppManager.loadingRegion.empty();
                                                AppManager.dialogRegion.show(hierSet);//HierSet View
                                            });
                                        });
                                        AppManager.loadingRegion.empty();
                                        AppManager.dialogRegion.show(view);//guidSet View
                                    });

                                });



                            } else {
                                ReportView = new View.MissingReport();
                                AppManager.mainRegion.show(ReportView);
                            }


                            MainLayout.on("show", function () {
                                MainLayout.headerPanel.show(HeaderView);
                                MainLayout.ContractPanel.show(ContractDetails);
                                MainLayout.ReportPanel.show(ReportView);
                                MainLayout.ReviewPanel.show(Menu);
                                AppManager.loadingRegion.empty();
                                console.log('hit on show ReportLayout');
                            });

                            AppManager.footerRegion.show(FooterView);
                            AppManager.mainRegion.show(MainLayout);


                        });
                    });
                });
            }
        }
    });

    return AppManager.ReportsApp.Show.Controller;
});
