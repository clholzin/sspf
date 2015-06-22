define(["app", "apps/auth/dashboard/show_view",
    "vendor/moment","backbone.filtered"], function(AppManager, View,Moment,FilteredCollection){
    AppManager.module("DashboardApp.Show", function(Show, AppManager, Backbone, Marionette, $, _){
        Show.Controller = {
            showDashboard: function(user){
                require(["common/views","entities/common", "entities/auth","entities/contracts"], function(CommonViews){
                console.log(user);

                     var fetchingNotify,
                        NotifyView,
                        ContractView,
                        filteredContracts,
                        filteredNotify,
                        MainView,
                        TopView,
                        FooterView;

                    FooterView = new CommonViews.Footer();
                    AppManager.footerRegion.show(FooterView);

                    var loadingView = new CommonViews.Loading({
                        title: "Dashboard",
                        message: "loading ..."
                    });

                    AppManager.loadingRegion.show(loadingView);

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


                        ContractView = new View.ContractView({
                            collection:filteredContracts
                        });
                        ContractView.on("contract:list", function(){
                            AppManager.trigger("contracts:list");
                        });
                        /**
                         *
                         * @type {View.Footer}
                         */
                        FooterView = new View.Footer({});
                        FooterView.on('footer:contract:edit',function(){
                           // AppManager.trigger("contract:edit", model.get("_id"));
                        });

                            FooterView.on("contract:new", function(){
                                require(["apps/contracts/new/new_view"], function(NewView){
                                    var newContract = AppManager.request("contract:entity:new");

                                    var view = new NewView.Contract({
                                        model: newContract
                                    });
                                    view.on("form:submit", function(data){
                                        console.log('New form data: ' + data);
                                        if (newContract.save(data)) {

                                            var fetchingContract = AppManager.request("contract:entities");
                                            $.when(fetchingContract).done(function(freshContracts) {
                                                var freshontracts = new FilteredCollection(freshContracts);
                                                freshontracts.filterBy('contractUser', function (model) {
                                                    return model.get('user').username === authorizedUser;
                                                });

                                                ContractView.collection = freshontracts;
                                                ContractView.render();
                                            });

                                            view.trigger("dialog:close");
                                            AppManager.execute("alert:show", ({type: "success", message: "Contract Added."}));
                                        } else {
                                            view.triggerMethod("form:data:invalid", newContract.validationError);
                                        }

                                    });

                                    AppManager.dialogRegion.show(view);
                                });
                            });

                            FooterView.on("notify:new", function(){
                                console.log('hit topleftView on event');
                                var newNotify = AppManager.request("notify:entity:new");
                                var view = new View.NotifyNew({
                                    model: newNotify,
                                    templateHelpers:function() {
                                        return {
                                            "contractId":'',
                                            "contractType":'',
                                            "year": Moment().get('year'),
                                            "dateNotify": Moment().format('YYYY-MM-DD'),
                                            "user":{ username:''}
                                        }
                                    }
                                });
                                view.on("form:submit", function(data){
                                    if(notifications.length > 0){
                                        //var highestId = _.max(notifications,function(c){ return c.id; }).get("id");
                                        data.id =  + 1;
                                    }else{
                                        data.id = 1;
                                    }
                                    if(data.contractId === ''){
                                        AppManager.execute("alert:show", ({
                                            type: "danger",
                                            message: "No Contract id present."
                                        }));
                                        return;
                                    }
                                    console.log('New form data: '+data);
                                    var savingNotify = newNotify.save(data);
                                    if(savingNotify){
                                        $.when(savingNotify).done(function() {
                                            notifications.add(newNotify);
                                            //notifications.reset(notifications.models);
                                            _.sortBy(notifications.models, 'dateNotify');
                                            view.trigger("dialog:close");
                                            var newNotifyView = LeftView.children.findByModel(newNotify);
                                            // check whether the new view is displayed (it could be
                                            // invisible due to the current filter criterion)
                                            if (newNotifyView) {
                                                newNotifyView.flash("animated fadeInRight bg-success");
                                                AppManager.execute("alert:show", ({
                                                    type: "success",
                                                    message: "Notification Added."
                                                }));
                                            }
                                        });
                                    }
                                    else{
                                        view.triggerMethod("form:data:invalid", newNotify.validationError);
                                        AppManager.execute("alert:show",({type:"danger",message:"Check fields for errors."}));
                                    }
                                });
                                AppManager.dialogRegion.show(view);
                            });


                            NotifyView = new View.LeftMenu({
                            collection:filteredNotify
                        });

                        NotifyView.on('childview:action:popover',function(childview,args){
                            console.log('hit');
                            var model = args.model;
                            var options = { viewport:{ "selector": "#viewport", "padding": 0 },html:true,placement:'auto right',title:'Contract Notification Report'};

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
                                '<div class="btn-group"><div class="btn btn-default js-show" data-id="'+model.get('_id')+'">View</div><div class="btn btn-primary ">Send for Approval</div></div>'+
                            '</div>'+
                            '</div>';
                            childview.$('button#btnPopover').data('content',html).popover(options,'toggle');
                        });






                        MainLayout.on("show", function(){
                           // MainLayout.TopPanel.show(TopView);
                            MainLayout.MainPanel.show(MainView);
                            MainLayout.NotifyPanel.show(NotifyView);
                            MainLayout.ContractPanel.show(ContractView);

                            var calLeftCurrent = $(document.body).find('td#calendar-left_cell_selected');
                            var calRightCurrent = $(document.body).find('td#calendar-right_cell_selected');
                            calLeftCurrent.removeAttr('class');
                            calRightCurrent.removeAttr('class');
                           console.log('hit on show MainLayout');
                        });



                            AppManager.loadingRegion.empty();
                            AppManager.mainRegion.show(MainLayout);
                            AppManager.footerRegion.show(FooterView);
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
