define(["app", "apps/contracts/edit/edit_view"], function(AppManager, View){
    AppManager.module("ContractsApp.Edit", function(Edit, AppManager, Backbone, Marionette, $, _,Moment){
        Edit.Controller = {
            editContract: function(id) {
                require(["common/views", "entities/contracts", "entities/edit_contract"],function (CommonViews) {



                        var FooterView = new CommonViews.Footer();
                        AppManager.footerRegion.show(FooterView);
                        var loadingView = new CommonViews.Loading({
                            title: "Edit Data",
                            message: "Loading"
                        });
                        AppManager.loadingRegion.show(loadingView);


                        AppManager.execute("set:edit:header", 'Contract');
                        var fetchingContract = AppManager.request("contract:entity", id);
                        $.when(fetchingContract).done(function (contract) {
                            var panelView,
                                editView,
                                editview,
                                reportingDates,
                                pricing,
                                deliverables,
                                metrics,
                                recoverBases,
                                payments,
                                milestones,
                                subcontractors,
                                ReportingDates,
                                FooterView,
                                HeaderView;

                            var layoutView = new View.Regions();

                            HeaderView = new CommonViews.Header({
                                title : "Contract Edit"
                            });

                            HeaderView.on('header:back',function(){
                                AppManager.trigger("contract:show", contract.get("_id"));
                            });

                            /**
                             *
                             * @type {View.Footer}
                             */
                            FooterView = new View.Footer({
                                model:contract
                            });
                            FooterView.on('footer:contract:save',function(model){
                               // model.save();
                            });

                        var fetchingPanelMenu = AppManager.request("editMenu:entities");
                        $.when(fetchingPanelMenu).done(function (menuList) {
                            panelView = new View.PanelItems({
                                collection: menuList
                            });

                            panelView.on("childview:navigate", function(childView, model){
                                var name = model.get("name");
                                var trigger = model.get("navigationTrigger");
                                console.log(trigger);
                                panelView.trigger(trigger);
                                AppManager.execute("set:edit:header", name);
                            });


                            panelView.on('contacts:show',function(){
                                editview = new View.Edit({
                                    model: contract,
                                    generateTitle: true
                                });
                                editview.on("form:submit", function (data) {
                                    if (contract.save(data)) {
                                        AppManager.execute("alert:show", ({
                                            type: "success",
                                            message: contract.get('title') + " Saved!"
                                        }));
                                        //AppManager.trigger("contract:show", contract.get('_id'));
                                        editView.render();
                                    }
                                    else {
                                        editView.triggerMethod("form:data:invalid", contract.validationError);
                                    }
                                });
                                layoutView.mainRegion.show(editview);
                            });

                            panelView.on('reporting:show',function(){
                              /**  loading  = new CommonViews.Loading({
                                    title: "One Sec :)",
                                    message: "Loading..."
                                });
                                layoutView.mainRegion.show(loading);**/
                                reportingDates = new View.ReportingDates({
                                    model: contract,
                                    generateTitle: true
                                });
                                reportingDates.on("form:submit", function (data) {
                                    if (contract.save(data)) {
                                        AppManager.execute("alert:show", ({
                                            type: "success",
                                            message: contract.get('title') + " Saved!"
                                        }));
                                        //AppManager.trigger("contract:show", contract.get('_id'));
                                        reportingDates.render();
                                    }
                                    else {
                                        reportingDates.triggerMethod("form:data:invalid", contract.validationError);
                                    }
                                });
                                layoutView.mainRegion.show(reportingDates);
                            });

                            panelView.on('pricing:show',function(){
                                pricing = new View.Pricing({
                                    model: contract,
                                    generateTitle: true
                                });
                                pricing.on("form:submit", function (data) {
                                    if (contract.save(data)) {
                                        AppManager.execute("alert:show", ({
                                            type: "success",
                                            message: contract.get('title') + " Saved!"
                                        }));
                                        //AppManager.trigger("contract:show", contract.get('_id'));
                                        pricing.render();
                                    }
                                    else {
                                        pricing.triggerMethod("form:data:invalid", contract.validationError);
                                    }
                                });
                                layoutView.mainRegion.show(pricing);
                            });

                            panelView.on('deliverables:show',function(){
                                deliverables = new View.Deliverables({
                                    model: contract,
                                    generateTitle: true
                                });
                                deliverables.on("form:submit", function (data,id) {
                                    console.log('form submit id:'+id);
                                    var objNew = $.grep(contract.get('deliverables'), function (item,index) {
                                        return index !== id;
                                    });
                                    objNew.push(data);
                                    console.log(JSON.stringify(contract.get('deliverables')));
                                    contract.set({"deliverables":objNew});
                                    if (contract.save()) {
                                        AppManager.execute("alert:show", ({
                                            type: "success",
                                            message: contract.get('title') + " Saved!"
                                        }));
                                        //AppManager.trigger("contract:show", contract.get('_id'));
                                        deliverables.render();
                                    }
                                    else {
                                        deliverables.triggerMethod("form:data:invalid", contract.validationError);
                                    }
                                });
                                layoutView.mainRegion.show(deliverables);
                            });

                            panelView.on('metrics:show',function(){
                                metrics = new View.Metrics({
                                    model: contract,
                                    generateTitle: true
                                });
                                metrics.on("form:submit", function (data) {
                                    if (contract.save(data)) {
                                        AppManager.execute("alert:show", ({
                                            type: "success",
                                            message: contract.get('title') + " Saved!"
                                        }));
                                        //AppManager.trigger("contract:show", contract.get('_id'));
                                        metrics.render();
                                    }
                                    else {
                                        metrics.triggerMethod("form:data:invalid", contract.validationError);
                                    }
                                });
                                layoutView.mainRegion.show(metrics);
                            });

                            panelView.on('recoverBases:show',function(){
                                recoverBases = new View.RecoveryBases({
                                    model: contract,
                                    generateTitle: true
                                });
                                recoverBases.on("form:submit", function (data) {
                                    if (contract.save(data)) {
                                        AppManager.execute("alert:show", ({
                                            type: "success",
                                            message: contract.get('title') + " Saved!"
                                        }));
                                        //AppManager.trigger("contract:show", contract.get('_id'));
                                        recoverBases.render();
                                    }
                                    else {
                                        recoverBases.triggerMethod("form:data:invalid", contract.validationError);
                                    }
                                });
                                layoutView.mainRegion.show(recoverBases);
                            });

                            panelView.on('payments:show',function(){
                                payments = new View.Payments({
                                    model: contract,
                                    generateTitle: true
                                });
                                payments.on("form:submit", function (data) {
                                    if (contract.save(data)) {
                                        AppManager.execute("alert:show", ({
                                            type: "success",
                                            message: contract.get('title') + " Saved!"
                                        }));
                                        //AppManager.trigger("contract:show", contract.get('_id'));
                                        payments.render();
                                    }
                                    else {
                                        payments.triggerMethod("form:data:invalid", contract.validationError);
                                    }
                                });
                                layoutView.mainRegion.show(payments);
                            });

                            panelView.on('milestones:show',function(){
                                milestones = new View.Milestones({
                                    model: contract,
                                    generateTitle: true
                                });
                                milestones.on("form:submit", function (data) {
                                    if (contract.save(data)) {
                                        AppManager.execute("alert:show", ({
                                            type: "success",
                                            message: contract.get('title') + " Saved!"
                                        }));
                                        //AppManager.trigger("contract:show", contract.get('_id'));
                                        milestones.render();
                                    }
                                    else {
                                        milestones.triggerMethod("form:data:invalid", contract.validationError);
                                    }
                                });
                                layoutView.mainRegion.show(milestones);
                            });

                            panelView.on('subcontractors:show',function(){
                                subcontractors = new View.SubContractors({
                                    model: contract,
                                    generateTitle: true
                                });
                                subcontractors.on("form:submit", function (data) {
                                    if (contract.save(data)) {
                                        AppManager.execute("alert:show", ({
                                            type: "success",
                                            message: contract.get('title') + " Saved!"
                                        }));
                                        //AppManager.trigger("contract:show", contract.get('_id'));
                                        subcontractors.render();
                                    }
                                    else {
                                        subcontractors.triggerMethod("form:data:invalid", contract.validationError);
                                    }
                                });
                                layoutView.mainRegion.show(subcontractors);
                            });

                        });//end of fetch headers



                            //console.log('Show Contract:' +JSON.stringify(contract));

                            if (contract instanceof Object) {
                                if (contract !== undefined) {
                                    editView = new View.Edit({
                                        model: contract,
                                        generateTitle: true
                                    });
                                    /**     function generateDates(startDate){
          var cnrDate = Moment(startDate,'YYYY/MM/DD').add(1,'M');

                            }
                                     if(contract.get('isNew') === 1){
                           var startDate=  contract.get('startDate');
                            generateDates(startDate);
                        }
                                     **/
                                    editView.on("form:submit", function (data) {
                                        if (contract.save(data)) {
                                            AppManager.execute("alert:show", ({
                                                type: "success",
                                                message: contract.get('title') + " Saved!"
                                            }));
                                            //AppManager.trigger("contract:show", contract.get('_id'));
                                            editView.render();
                                        }
                                        else {
                                            editView.triggerMethod("form:data:invalid", contract.validationError);
                                        }
                                    });


                                    ReportingDates = new View.ReportingDates({});


                                }//end if contract undefined

                                layoutView.on("show", function () {
                                    layoutView.headerPanel.show(HeaderView);
                                    layoutView.panelRegion.show(panelView);
                                    layoutView.mainRegion.show(editView);
                                    AppManager.loadingRegion.empty();
                                    console.log('hit on show');
                                });
                            } else {

                                var missing = new View.MissingContract();
                                AppManager.mainRegion.show(missing);
                            }

                            AppManager.footerRegion.show(FooterView);
                            AppManager.mainRegion.show(layoutView);
                        });
                    });
            },

                setActiveHeader: function(headerUrl){
                    console.log('Header Url  '+headerUrl);
                    var links = AppManager.request("editMenu:entities");
                    //console.log(JSON.stringify(links));
                    var headerToSelect = links.find(function(header){ return header.get("name") === headerUrl; });
                    headerToSelect.select();
                    links.trigger("reset");
                }

        };
    });

    return AppManager.ContractsApp.Edit.Controller;
});
