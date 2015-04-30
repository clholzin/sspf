define(["app", "apps/contracts/list/list_view"], function(AppManager, View){
  AppManager.module("ContractsApp.List", function(List, AppManager, Backbone, Marionette, $, _){
    List.Controller = {
      listContracts: function(criterion){
        require(["common/views", "entities/contracts"], function(CommonViews){
          var loadingView = new CommonViews.Loading();
          AppManager.mainRegion.show(loadingView);

          var fetchingContracts = AppManager.request("contracts:entities");

          var contractsListLayout = new View.Layout();
          var contractsListPanel = new View.Panel();

          require(["entities/common"], function(FilteredCollection){
            $.when(fetchingContracts).done(function(contracts){
              var filteredContracts = AppManager.Entities.FilteredCollection({
                collection: contracts,
                filterFunction: function(filterCriterion){
                  var criterion = filterCriterion.toLowerCase();
                  return function(contract){
                    if(contract.get('name').toLowerCase().indexOf(criterion) !== -1
                      || contract.get('date').toLowerCase().indexOf(criterion) !== -1
                    ){
                        return contract;
                    }
                  };
                }
              });

              if(criterion){
                filteredContracts.filter(criterion);
                  contractsListPanel.once("show", function(){
                    contractsListPanel.triggerMethod("set:filter:criterion", criterion);
                });
              }

              var contractsListView = new View.Contracts({
                collection: filteredContracts
              });

                contractsListPanel.on("contracts:filter", function(filterCriterion){
                  filteredContracts.filter(filterCriterion);
                AppManager.trigger("contracts:filter", filterCriterion);
              });

                contractsListLayout.on("show", function(){
                  contractsListLayout.panelRegion.show(contractsListPanel);
                  contractsListLayout.contractsRegion.show(contractsListView);
              });

                contractsListPanel.on("contract:new", function(){
                require(["apps/contracts/new/new_view"], function(NewView){
                  var newContract = AppManager.request("contract:entity:new");

                  var view = new NewView.Contract({
                    model: newContract
                  });

                  view.on("form:submit", function(data){
                    if(contracts.length > 0){
                      var highestId = contracts.max(function(c){ return c.id; }).get("_id");
                      data.id = highestId + 1;
                    }else{
                      data.id = 1;
                    }
                    if(newContract.save(data)){
                      contracts.add(newContract);
                      view.trigger("dialog:close");
                      var newContractView = contractsListView.children.findByModel(newContract);
                      // check whether the new contract view is displayed (it could be
                      // invisible due to the current filter criterion)
                      if(newContractView){
                        newContractView.flash("success");
                      }
                    }
                    else{
                      view.triggerMethod("form:data:invalid", newContract.validationError);
                    }
                  });

                  AppManager.dialogRegion.show(view);
                });
              });

              contractsListView.on("childview:contract:show", function(childView, args){
                  console.log(args.model.get("_id"));
                AppManager.trigger("contract:show", args.model.get("_id"));
              });

              contractsListView.on("childview:contract:edit", function(childView, args){
                require(["apps/contracts/edit/edit_view"], function(EditView){
                  var model = args.model;
                  var view = new EditView.Contract({
                    model: model
                  });

                  view.on("form:submit", function(data){
                      console.log('submitte data event: '+ JSON.stringify(data));
                    if(model.save(data,{wait:true})){
                         //  console.log(view);
                        model.set(data);
                        //view.triggerMethod("initialize");
                        childView.render();
                            AppManager.execute("alert:show",({type:"success",message:" Saved!!!"}));
                            view.trigger("dialog:close");
                            childView.flash("success");
                    }
                    else{
                        AppManager.execute("alert:show",({type:"danger",message:"Error trying to update."}));
                      view.triggerMethod("form:data:invalid", model.validationError);
                    }
                  });
                  AppManager.dialogRegion.show(view);
                });
              });

              contractsListView.on("childview:contract:delete", function(childView, args){
                  console.log(args.model.get('_id'));
               /**
                * Not Currently Working  **/
                    confirm('Are you sure you want to Delete',function(){
                        //contract:entities
                        args.model.destroy({
                            success: function(model, response) {
                                console.log(JSON.stringify(response));
                                AppManager.execute("alert:show",({type:"success",message:JSON.stringify(response)}));
                            },
                            error:function(model,response){
                                AppManager.execute("alert:show",({type:"danger",message:JSON.stringify(response)}));
                            }
                        });
                    });

              });

              AppManager.mainRegion.show(contractsListLayout);
            });
          });
        });
      }
    }
  });

  return AppManager.ContractsApp.List.Controller;
});


