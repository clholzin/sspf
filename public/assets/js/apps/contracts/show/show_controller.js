define(["app", "apps/contracts/show/show_view",
    "vendor/moment","backbone.filtered"], function(AppManager, View,Moment,FilteredCollection){
    AppManager.module("ContractsApp.Show", function(Show, AppManager, Backbone, Marionette, $, _){
        Show.Controller = {
            showContract: function(id){
                require(["common/views","entities/common", "entities/contracts","entities/gateway"], function(CommonViews,QCRdates){
                    var  contractView,
                        LeftView,
                        RightView,
                        MainExport,
                        costSetView,
                        TopLeftView,
                        FooterView;

                    FooterView = new CommonViews.Footer();
                    AppManager.footerRegion.show(FooterView);

                    var loadingView = new CommonViews.Loading({
                        title: "Contract",
                        message: "loading ..."
                    });
                  AppManager.loadingRegion.show(loadingView);

                    var sideAndMainLayout = new View.Regions();

                    if(id === '' || undefined){
                        window.history.back();
                    }

                    var fetchingContract = AppManager.request("contract:entity", id);
                    var fetchingNotify = AppManager.request("notify:entities", id);
                    $.when(fetchingContract).done(function(contract){
                        $.when(fetchingNotify).done(function(notifications) {
                   //console.log('Show Contract:' +JSON.stringify(contract));

                        if(contract instanceof Object){

                            contractView = new View.Contract({
                                model: contract
                                });

                            FooterView = new View.Footer({
                                model: contract
                            });
                            AppManager.footerRegion.show(FooterView);
                            FooterView.on('footer:contract:edit',function(model){
                                AppManager.trigger("contract:edit", model.get("_id"));
                            });

                        /**Add Notification dates for QCR
                         * Save to notification DB & Copied for backup to contract
                         **/
                         /**   console.log(contract.get('project') );
                            var project = contract.get('project');
                            if(project.id != '' || undefined) {
                                var startDate = Moment(contract.get('startDate'));//unformated date now
                                var qcrDates =  AppManager.Entities.QCRdates(startDate,id);
                                console.log(JSON.stringify(qcrDates));
                                        _.each(qcrDates, function (value) {
                                            notifications.create(value);
                                           // contract.attributes.reports.qcr.occurs.push(qcrDate)
                                    });
                                  var update = {newContract:false};
                                   contract.save(update,{wait:true});

                            }//end adding new notify dates

                            **/

                            contractView.on('businessUnit:add',function(data){
                                var objData = $.grep(contract.get('businessUnit'), function(item) {
                                    return item;
                                });
                                //console.log(JSON.stringify(objData));
                                objData.push(data);
                                console.log(JSON.stringify(objData));
                                //contract.attributes.comments.push(data);
                                contract.set({'businessUnit':objData});
                                var savingModel = contract.save({"businessUnit":contract.get('businessUnit')});
                                if(savingModel){
                                    // console.log('submit data event: ' + JSON.stringify(model));
                                   // contract.fetch();
                                    //contractView.render();
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





                            contractView.on("contract:edit", function(model){
                                AppManager.trigger("contract:edit", model.get("_id"));
                            });
                            contractView.on("contract:list", function(){
                                AppManager.trigger("contracts:list");
                            });
                            contractView.on("contract:export", function(contract){
                                var view = new CommonViews.Loading({
                                    title: "URS List",
                                    message: "Loading..."
                                });
                                AppManager.dialogRegion.show(view);
                                var fetchingUrsSet= AppManager.request("urs:entities");
                                $.when(fetchingUrsSet).done(function(ursSet) {
                                    MainExport = new View.ContractExport({
                                        collection: ursSet
                                    });
                                    MainExport.on("back:clicked",function(){
                                        AppManager.trigger("contract:show", contract.get("_id"));
                                    });
                                    //console.log(JSON.stringify(ursSet));
                                    AppManager.dialogRegion.show(MainExport);
                                });

                            });
                            contractView.on("contract:guidSet", function(contract){
                                var view = new CommonViews.Loading({
                                    title: "",
                                    message: ""
                                    /**  title: "Project List",
                                    message: "Loading..."**/
                                });
                                AppManager.dialogRegion.show(view);
                                var id = '5';
                                var fetchingGuidSets = AppManager.request("guidSet:entities",id);

                                $.when(fetchingGuidSets).done(function(guidSet) {
                                    view = new View.GuidSet({
                                        collection: guidSet
                                    });

                                    view.on("contract:runid", function(){
                                        var view = new CommonViews.Loading({
                                            title: "",
                                            message: ""
                                            /**  title: "Project List",
                                             message: "Loading..."**/
                                        });
                                        AppManager.dialogRegion.show(view);
                                        var Runid = '2';
                                        var fetchingGuidSets = AppManager.request("guidSet:entities",Runid);
                                        $.when(fetchingGuidSets).done(function(guidSet) {
                                            var runId = new View.GuidSet({
                                                collection: guidSet
                                            });
                                            //  AppManager.dialogRegion.show(costSetView);
                                            AppManager.dialogRegion.show(runId);
                                        });
                                    });

                                    view.on("contract:costValueSet", function(){
                                        var view = new CommonViews.Loading({
                                            title: "",
                                            message: ""
                                            /**  title: "Cost Values List",
                                            message: "Loading..."**/
                                        });
                                        AppManager.dialogRegion.show(view);
                                        var rid = 'E50A16DF5DE960F18482005056A46058';
                                        console.log('trigger: '+ rid);
                                        var fetchingCostSets = AppManager.request("costSet:entities",rid);
                                        $.when(fetchingCostSets).done(function(costSet) {
                                        //    console.log('costs: '+ JSON.stringify(costSet.models));
                                             costSetView = new View.CostValueView({
                                                collection: costSet
                                            });
                                          //  AppManager.dialogRegion.show(costSetView);
                                            AppManager.dialogRegion.show(costSetView);
                                        });
                                    });

                                    view.on("contract:dpsSet", function(did){
                                        var view = new CommonViews.Loading({
                                            title: "",
                                            message: ""
                                            /** title: "MOD Project Structure",
                                            message: "Loading..."**/
                                        });
                                        AppManager.dialogRegion.show(view);
                                        console.log('trigger: '+ id);
                                        var fetchingDpsSets = AppManager.request("dpsSet:entities",did);
                                        $.when(fetchingDpsSets).done(function(dpsSet) {
                                            var dpsset = new View.DpsSet({
                                                collection: dpsSet
                                            });

                                            AppManager.dialogRegion.show(dpsset);//dpsSet View
                                        });
                                    });

                                    view.on("contract:HierSet", function(pid){
                                        var view = new CommonViews.Loading({
                                            title: "",
                                            message: ""
                                            /**    title: "Alternative Heirarchy List",
                                            message: "Loading..."**/
                                        });
                                        AppManager.dialogRegion.show(view);
                                        console.log('trigger: '+ id);
                                        var fetchingHierSet = AppManager.request("hierSet:entities",pid);
                                        $.when(fetchingHierSet).done(function(hierData) {
                                           var hierSet = new View.HierSet({
                                                collection: hierData
                                            });
                                            hierSet.on("contract:dpsSet", function(did){
                                                var view = new CommonViews.Loading({
                                                    title: "MOD Project Structure",
                                                    message: "Loading..."
                                                });
                                                AppManager.dialogRegion.show(view);
                                                console.log('trigger: '+ id);
                                                var fetchingDpsSets = AppManager.request("dpsSet:entities",did);
                                                $.when(fetchingDpsSets).done(function(dpsData) {
                                                    var dpsset = new View.DpsSet({
                                                        collection: dpsData
                                                    });

                                                    AppManager.dialogRegion.show(dpsset);//dpsSet View
                                                });
                                            });

                                           AppManager.dialogRegion.show(hierSet);//HierSet View
                                        });
                                    });

                                    AppManager.dialogRegion.show(view);//guidSet View
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
                              //console.log(JSON.stringify(objData));
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




                 var filtered = new FilteredCollection(notifications);

                var date = Moment().add(1,'y').add(6,'m').unix();
                filtered.filterBy('date', function (model) {
                    var unixModel = Moment(model.get('dateNotify')).unix();
                    return unixModel < date;
                });

                TopLeftView = new View.TopLeftView({
                    templateHelpers:function(){
                        return{
                            'notifyCount': filtered.length
                        }
                    }
                });

                TopLeftView.on("notify:filterByType", function(type) {
                    switch (type) {
                        case 'ccr':
                            filtered.filterBy('contractType', function (model) {
                                return model.get('contractType') === type;
                            });
                            break;
                        case 'ccs':
                            filtered.filterBy('contractType', function (model) {
                                return model.get('contractType') === type;
                            });
                            break;
                        case 'qcr':
                            filtered.filterBy('contractType', function (model) {
                                return model.get('contractType') === type;
                            });
                            break;
                        case 'icr':
                            filtered.filterBy('contractType', function (model) {
                                return model.get('contractType') === type;
                            });
                            break;
                        case 'crp':
                            filtered.filterBy('contractType', function (model) {
                                return model.get('contractType') === type;
                            });
                            break;
                        case 'cnr':
                            filtered.filterBy('contractType', function (model) {
                                return model.get('contractType') === type;
                            });
                            break;
                        case 'default':
                            filtered.removeFilter('contractType');
                            filtered.refilter();
                            break;
                    }
                   // view  = new LeftView({ collection: filtered });
                   // sideAndMainLayout.leftRegion.show(view);
                });
                    LeftView = new View.LeftMenu({
                        collection: filtered,
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
                            LeftView.on("childview:action:popover", function(childView,args){
                                // this.$('[data-toggle="popover"]').popover();
                                var options = {html:true,placement:'left'};
                                var html = '<button id="notify-edit" class="btn btn-sm btn-default"><i class="glyphicon glyphicon-edit"></i> </button>'+
                                    '<button class="btn btn-sm btn-danger js-delete"><i class="glyphicon glyphicon-remove-sign"></i> </button>';
                                childView.$('button#btnPopover').data('content',html).popover(options,'toggle');
                            });


                            LeftView.on("childview:action:report", function(childView,args){
                                var model = args.model;
                                console.log('hit childview action:report '+model.get('_id'));
                                AppManager.trigger('report:show',model.get('_id'));
                            });


                            LeftView.on("childview:notify:delete", function(childView, args){
                                console.log(args.model.get('_id'));
                                var title = args.model.get('contractType').toUpperCase();
                                if(confirm('Are you sure you want to Delete '+title)){
                                    childView.flash("animated fadeOutLeft bg-danger");
                                    args.model.destroy();
                                    AppManager.execute("alert:show",({type:"info",message:'Deleted '+title}));
                                }
                            });








                            sideAndMainLayout.on("show", function(){
                                sideAndMainLayout.leftRegion.show(LeftView);
                                sideAndMainLayout.mainRegion.show(contractView);
                                loadingView.trigger("dialog:close");
                                sideAndMainLayout.rightRegion.show(RightView);
                                sideAndMainLayout.topLeftRegion.show(TopLeftView);
                                console.log('hit on show');
                            });


                        }
                        else{

                            var missing = new View.MissingContract();
                            AppManager.mainRegion.show(missing);
                        }

                        AppManager.loadingRegion.empty();
                        AppManager.mainRegion.show(sideAndMainLayout);
                        });//end of fetching notifications
                    });// end of fetching contract

                });
            }
        }
    });

    return AppManager.ContractsApp.Show.Controller;
});
