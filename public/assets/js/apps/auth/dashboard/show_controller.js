define(["app", "apps/auth/dashboard/show_view",
    "vendor/moment","backbone.filtered"], function(AppManager, View,Moment,FilteredCollection){
    AppManager.module("DashboardApp.Show", function(Show, AppManager, Backbone, Marionette, $, _){
        Show.Controller = {
            showDashboard: function(user){
                require(["common/views","entities/common", "entities/auth","entities/contracts"], function(CommonViews){
                console.log(user);

                    var loadingView = new CommonViews.Loading({
                        title: "Dashboard",
                        message: "loading ..."
                    });

                    AppManager.mainRegion.show(loadingView);


                    var fetchingNotify,
                        NotifyView,
                        ContractView,
                        filteredContracts,
                        filteredNotify,
                        MainView,
                        TopView;


                    var fetchingUser = AppManager.request("login:entity");
                    $.when(fetchingUser).done(function(loginUser) {
                       // console.log(JSON.stringify(loginUser));
                        //  if(contract instanceof Object){
                        if(loginUser.attributes.loggedIn === 1){
                            console.log('Dashboard Hit');
                    //console.log(AppManager.user.username);
                        var authorizedUser = loginUser.get('username');

                    var MainLayout = new View.Regions();


                    var fetchingContract = AppManager.request("contract:entities");
                    $.when(fetchingContract).done(function(contracts){
                        filteredContracts = new FilteredCollection(contracts);
                        filteredContracts.filterBy('contractUser', function (model) {
                            return model.get('user').username === authorizedUser;
                        });

                        fetchingNotify = AppManager.request("notify:entities:all");
                        $.when(fetchingNotify).done(function(notifications){

                        //$.when(fetchingNotify).done(function(notifications) {
                        //console.log('Show Contract:' +JSON.stringify(contract));
                        filteredNotify = new FilteredCollection(notifications);

                        filteredNotify.filterBy('Notify', function (model) {
                            return model.get('user').username === authorizedUser;
                        });

                        var date = Moment().add(6,'months').unix();
                        filteredNotify.filterBy('date', function (model) {
                            var unixModel = Moment(model.get('dateNotify')).unix();
                            return unixModel < date;
                        });


                        TopView = new View.Top({
                            templateHelpers:function(){
                                return{
                                    username:String(authorizedUser).toUpperCase()
                                }
                            }
                        });

                        MainView = new View.Calendar({
                            collection:filteredNotify
                        });


                        NotifyView = new View.LeftMenu({
                            collection:filteredNotify
                        });
                        NotifyView.on('childview:action:popover',function(childview,args){
                            console.log('hit');
                            var model = args.model;
                            var options = {html:true,placement:'left',title:'Contract Notification Report'};

                            var html = '<div style="width:auto;padding:10px;">'+
                            '<div class="row">'+
                            '<div class="col-md-3 col-sm-3">'+
                            '<div class="well well-sm"><i class="glyphicon glyphicon-user"></i></div> '+
                            '</div>'+
                            '<div class="col-md-8 col-sm-8">Contract Id:'+
                                String(model.get('contractId')).substr(0,4)+'<br>'+
                            'Due:'+Moment.utc(model.get('dateNotify')).fromNow()+
                            '</div>'+
                            '</div>'+
                            '<div class="row">'+
                            '<div class="h3">Report Details</div>'+
                            '<div class="text-warning">Status:Waiting Approval</div>'+
                            '<div class="text-success">Created:'+Moment.utc(model.get('dateCreated')).fromNow()+'</div>'+
                            '<div class="text-primary">Assigned To:'+String(model.get('user').username).toUpperCase()+'</div>'+
                            '<div class="text-primary">Email:'+model.get('user').username+'@dassian.com</div>'+
                            '<div class="text-primary">Schedule:Name</div><br>'+
                                '<div class="btn btn-primary btn-block">Send for Approval</div>'+
                            '</div>'+
                            '</div>';
                            childview.$('button#btnPopover').data('content',html).popover(options,'toggle');
                        });

                          ContractView = new View.ContractView({
                            collection:filteredContracts
                        });
                        MainLayout.on("show", function(){
                            MainLayout.TopPanel.show(TopView);
                            MainLayout.MainPanel.show(MainView);
                            MainLayout.NotifyPanel.show(NotifyView);
                            MainLayout.ContractPanel.show(ContractView);


                            var calLeftCurrent = $(document.body).find('td#calendar-left_cell_selected');
                            var calRightCurrent = $(document.body).find('td#calendar-right_cell_selected');
                            calLeftCurrent.removeAttr('class');
                            calRightCurrent.removeAttr('class');

                           console.log('hit on show MainLayout');
                        });

                       AppManager.mainRegion.show(MainLayout);

                        });//end of fetching notifications
                    });//end of fetching contract

                }else{
                    AppManager.trigger("auth:login");
                           /** var missing = new View.MissingContract();
                            AppManager.mainRegion.show(missing);**/
                }//verify user

            //     AppManager.mainRegion.show(MainLayout);
                        //  }if user is true continue
                    // });verify user
                    });
                });
            }

        }
    });

    return AppManager.DashboardApp.Show.Controller;
});
