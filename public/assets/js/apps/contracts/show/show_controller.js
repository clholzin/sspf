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
                             RightList,
                             MainExport,
                             TopLeftView;
                        if(contract instanceof Object){

                                contractView = new View.Contract({
                                    model: contract
                                    });

                            contractView.on("contract:edit", function(model){
                                AppManager.trigger("contract:edit", model.get("_id"));
                            });
                            contractView.on("contract:list", function(){
                                AppManager.trigger("contracts:list");
                            });
                            contractView.on("contract:export", function(contract){
                                var fetchingUsrSets = AppManager.request("urs:entities");
                                $.when(fetchingUsrSets).done(function(ursSets) {
                                    MainExport = new View.ContractExport({
                                        collection: ursSets
                                    });
                                    MainExport.on("back:clicked",function(){
                                        AppManager.trigger("contract:show", contract.get("_id"));
                                    });
                                    //console.log(JSON.stringify(ursSets));
                                sideAndMainLayout.mainRegion.show(MainExport);
                                });
                            });

                            contractView.on("price:update",function(data){
                                    var savingModel = contract.save(data);
                                    if(savingModel){
                                        $.when(savingModel).done(function() {
                                            // console.log('submit data event: ' + JSON.stringify(model));
                                            contract.set(data);
                                            contractView.render();
                                            contractView.flash("animated fadeIn bg-success");
                                            AppManager.execute("alert:show",({
                                                type: "success",
                                                message: "Saved"
                                            }));
                                            // notifications.reset(notifications.models);
                                            //view.trigger("dialog:close");
                                        });
                                    }
                                    else{
                                        contractView.triggerMethod("form:data:invalid", contract.validationError);
                                        AppManager.execute("alert:show",({type:"danger",message:"Check fields for errors."}));
                                    }

                            });

                            RightView = new View.Right({
                                model: contract
                            });

                          RightView.on('comment:add',function(data){
                              var objData = $.grep(contract.get('comments'), function(item) {
                                  return item;
                              });
                              console.log(JSON.stringify(objData));
                              objData.push(data);
                              console.log(JSON.stringify(objData));
                              //contract.attributes.comments.push(data);
                              contract.set({'comments':objData});
                              var savingModel = contract.save({"comments":contract.get('comments')});
                              if(savingModel){
                                      // console.log('submit data event: ' + JSON.stringify(model));
                                      contract.fetch();
                                      RightView.render();
                                     // RightView.flash("animated fadeIn bg-success");
                                      AppManager.execute("alert:show",({
                                          type: "success",
                                          message: "Saved"
                                      }));
                              }
                              else{
                                  RightView.triggerMethod("form:data:invalid", model.validationError);
                                  AppManager.execute("alert:show",({type:"danger",message:"Check fields for errors."}));
                              }
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


                    LeftView.on("childview:notify:edit", function(childView,args){
                           var model = args.model;
                            //console.log(model);
                            var view = new View.NotifyEdit({
                                model: model,
                                templateHelpers:function() {
                                    return {
                                        "contractId": args.model.get('contractId'),
                                        "contractType":args.model.get('contractType'),
                                        "year": args.model.get('year'),
                                        "dateNotify": Moment(args.model.get('dateNotify')).format('YYYY-MM-DD'),
                                        "user":{ username:args.model.get('user').username}
                                    }
                                }
                            });
                            view.on("form:submit", function(data){
                                var savingModel = model.save(data);
                                    if(savingModel){
                                        $.when(savingModel).done(function() {
                                           // console.log('submit data event: ' + JSON.stringify(model));
                                            model.set(data);
                                            childView.render();
                                            childView.flash("animated fadeInRight bg-success");
                                            AppManager.execute("alert:show",({
                                                type: "success",
                                                message: "Saved"
                                            }));
                                            // notifications.reset(notifications.models);
                                            view.trigger("dialog:close");

                                        });
                                    }
                                    else{
                                        view.triggerMethod("form:data:invalid", model.validationError);
                                        AppManager.execute("alert:show",({type:"danger",message:"Check fields for errors."}));
                                    }
                                });

                            AppManager.dialogRegion.show(view);
                            //  });
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



                        AppManager.mainRegion.show(sideAndMainLayout);
                        });//end of fetching notifications
                    });// end of fetching contract

                });
            }
        }
    });

    return AppManager.ContractsApp.Show.Controller;
});
