define(["app", "apps/contracts/show/show_view","vendor/moment"], function(AppManager, View,Moment){
    AppManager.module("ContractsApp.Show", function(Show, AppManager, Backbone, Marionette, $, _){
        Show.Controller = {
            showContract: function(id){
                require(["common/views", "entities/contracts"], function(CommonViews){
                    var loadingView = new CommonViews.Loading({
                        title: "Contract",
                        message: "Loading..."
                    });
                    AppManager.mainRegion.show(loadingView);

                    var sideAndMainLayout = new View.Regions();

                    var fetchingContract = AppManager.request("contract:entity", id);
                    var fetchingNotify = AppManager.request("notify:entities", id);
                    $.when(fetchingContract).done(function(contract){
                        $.when(fetchingNotify).done(function(notifications) {
                   //console.log('Show Contract:' +JSON.stringify(contract));
                    var contractView,
                    LeftView,
                    RightView,
                    TopLeftView,
                    FooterView;
                        if(contract instanceof Object){

                                contractView = new View.Contract({
                                    model: contract
                                    });

                                TopLeftView = new View.TopLeftView({
                                    //  model: contract
                                    });

                              //  console.log('Notifications: '+JSON.stringify(notifications));
                                LeftView = new View.LeftMenu({
                                    collection: notifications,
                                    contractId: contract.get("_id")
                                    });

                            TopLeftView.on("notify:new", function(){
                                console.log('hit topleftView on event');
                                        var newNotify = AppManager.request("notify:entity:new");
                                        var view = new View.NotifyNew({
                                            model: newNotify,
                                            templateHelpers:function() {
                                                return {
                                                    "contractId": contract.get("_id"),
                                                    "contractType":'',
                                                    "year": Moment().get('year'),
                                                    "dateNotify": Moment().format('YYYY-MM-DD'),
                                                    "user":''
                                                }
                                            }
                                        });
                                        view.on("form:submit", function(data){
                                            if(notifications.length > 0){
                                                //var highestId = _.max(contracts,function(c){ return c.id; }).get("id");
                                                data.id = + 1;
                                            }else{
                                                data.id = 1;
                                            }
                                            console.log('New form data: '+data);
                                            if(newNotify.save(data)){
                                                notifications.add(newNotify);
                                                view.trigger("dialog:close");
                                                var newNotifyView = LeftView.children.findByModel(newNotify);
                                                // check whether the new contract view is displayed (it could be
                                                // invisible due to the current filter criterion)
                                                if(newNotifyView){
                                                    newNotifyView.flash("animated fadeInRight bg-success");
                                                    AppManager.execute("alert:show",({type:"success",message:"Notification Added."}));
                                                }
                                            }
                                            else{
                                                view.triggerMethod("form:data:invalid", newContract.validationError);
                                            }
                                        });
                                        AppManager.dialogRegion.show(view);
                                    });


                                LeftView.on("childview:notify:edit", function(childView,args){
                                        var model = args.model;
                                        var id = args.model.get('_id');
                                    var saveNotify = AppManager.request("notify:entity",id);
                                    $.when(saveNotify).done(function(notify) {
                                        var view = new View.NotifyEdit({
                                            model: notify,
                                            templateHelpers:function() {
                                                return {
                                                    "contractId": args.model.get('contractId'),
                                                    "contractType":args.model.get('contractType'),
                                                    "year": args.model.get('year'),
                                                    "dateNotify": Moment(args.model.get('dateNotify')).format('YYYY-MM-DD'),
                                                    "user":args.model.get('user').username
                                                }
                                            }
                                        });
                                        view.on("form:submit", function(data){
                                            console.log(id);
                                                notify.set(data, {silent: false});
                                            var saving = notify.save(data, {wait: false});
                                            if(saving){
                                                $.when(saving).done(function(){
                                                    childView.render();
                                                    AppManager.execute("alert:show",({type:"success",message:"Saved"}));
                                                    view.trigger("dialog:close");
                                                    childView.flash("animated fadeInRight bg-success");
                                                }).fail(function(response){
                                                    if(response.status === 422){
                                                        view.onDestroy = function(){
                                                            notify.set(response.responseJSON.entity);
                                                        };

                                                        var keys = ['contractId', 'contractType', 'year', 'dateNotify'];
                                                        notify.refresh(response.responseJSON.entity, keys);

                                                        view.render();
                                                        view.triggerMethod("form:data:invalid", response.responseJSON.errors);
                                                        notify.set(response.responseJSON.entity, {silent:true});
                                                    }
                                                    else{
                                                       // alert(t("generic.unprocessedError"));
                                                        AppManager.execute("alert:show",({type:"danger",message:"Error trying to update."}));
                                                    }
                                                });
                                            }
                                            else{
                                                view.onDestroy = function(){
                                                    notify.set(notify.previousAttributes());
                                                };

                                                view.triggerMethod("form:data:invalid", notify.validationError);
                                            }
                                            /** if(model.save(data,{wait:true})){
                                                console.log('submit data event: '+ JSON.stringify(model));
                                                //  console.log(view);
                                                model.set(data);
                                                //view.triggerMethod("initialize");
                                                childview.render();
                                                AppManager.execute("alert:show",({type:"success",message:"Saved"}));
                                                view.trigger("dialog:close");
                                                childview.flash("animated fadeInRight bg-success");
                                            }
                                            else{
                                                AppManager.execute("alert:show",({type:"danger",message:"Error trying to update."}));
                                                view.triggerMethod("form:data:invalid", model.validationError);
                                            }**/
                                        });

                                        AppManager.dialogRegion.show(view);
                                    });
                                });
                            LeftView.on("childview:action:popover", function(childview,args){
                                // this.$('[data-toggle="popover"]').popover();
                                var options = {html:true,placement:'left'};
                                var html = '<button id="notify-edit" class="btn btn-sm btn-default"><i class="glyphicon glyphicon-edit"></i> </button>'+
                                    '<button class="btn btn-sm btn-danger js-delete"><i class="glyphicon glyphicon-remove-sign"></i> </button>';
                                childview.$('button#btnPopover').data('content',html).popover(options,'toggle');
                            });
                            LeftView.on("childview:notify:delete", function(childView, args){
                                console.log(args.model.get('_id'));
                                var title = args.model.get('contractType').toUpperCase();
                                if(confirm('Are you sure you want to '+title+' Delete')){
                                    childView.flash("animated fadeOutLeft bg-danger");
                                    args.model.destroy();
                                    AppManager.execute("alert:show",({type:"info",message:'Deleted '+title}));
                                }
                            });

                                RightView = new View.RightMenu({
                                    //  model: contract
                                });


                            contractView.on("contract:edit", function(contract){
                                AppManager.trigger("contract:edit", contract.get("_id"));
                            });

                            sideAndMainLayout.on("show", function(){
                                sideAndMainLayout.leftRegion.show(LeftView);
                                sideAndMainLayout.mainRegion.show(contractView);
                                sideAndMainLayout.rightRegion.show(RightView);
                                sideAndMainLayout.topLeftRegion.show(TopLeftView);
                                console.log('hit on show');
                            });
                        }
                        else{

                            var missing = new View.MissingContract();
                            AppManager.mainRegion.show(missing);
                        }


                        AppManager.footerRegion.show(FooterView);
                        AppManager.mainRegion.show(sideAndMainLayout);
                        });//end of fetching notifications
                    });// end of fetching contract

                });
            }
        }
    });

    return AppManager.ContractsApp.Show.Controller;
});
