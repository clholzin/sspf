define(["app", "apps/reports/list/list_view"], function(AppManager, View){
  AppManager.module("ReportsApp.List", function(List, AppManager, Backbone, Marionette, $, _){
    List.Controller = {
      listReports: function(criterion){
        require(["common/views", "entities/contact"], function(CommonViews){
          var loadingView = new CommonViews.Loading();
          AppManager.mainRegion.show(loadingView);

          var fetchingReport = AppManager.request("contact:entities");

          var reportsListLayout = new View.Layout();
          var reportsListPanel = new View.Panel();

          require(["entities/common"], function(FilteredCollection){
            $.when(fetchingReport).done(function(reports){
              var filteredReport = AppManager.Entities.FilteredCollection({
                collection: reports,
                filterFunction: function(filterCriterion){
                  var criterion = filterCriterion.toLowerCase();
                  return function(contact){
                    if(contact.get('username').toLowerCase().indexOf(criterion) !== -1
                      || contact.get('roles').indexOf(criterion) !== -1
                    ){
                        return contact;
                    }
                  };
                }
              });

              if(criterion){
                  filteredReport.filter(criterion);
                reportsListPanel.once("show", function(){
                  reportsListPanel.triggerMethod("set:filter:criterion", criterion);
                });
              }

              var reportsListView = new View.Reports({
                collection: filteredReport
              });

              reportsListPanel.on("reports:filter", function(filterCriterion){
                  filteredReport.filter(filterCriterion);
                AppManager.trigger("reports:filter", filterCriterion);
              });

              reportsListLayout.on("show", function(){
                reportsListLayout.panelRegion.show(reportsListPanel);
                reportsListLayout.reportsRegion.show(reportsListView);
              });

                reportsListPanel.on("report:new", function(){
                    require(["apps/reports/new/new_view","entities/auth"], function(NewView){
                        var view = new NewView.Report();
                        view.on("form:submit", function(data){

                            var newReport = AppManager.request("login:entity:new");
                              var saveCheck =  newReport.save(data,{wait:true,
                                    success:function(model,response){
                                        if(response.info){
                                            AppManager.triggerMethod("form:data:invalid", model.validationError);
                                            AppManager.execute("alert:show",({type:"warning",message:response.info}));
                                        }
                                       // reports.add(model,{at:0});
                                        reports.fetch();
                                       // console.log(reports.models.attributes);
                                        view.trigger("dialog:close");
                                        //compView.children.findByModel(collection.get({id: elId}))
                                        var findModel = reports.findWhere({'username':response.username});
                                        var display = reports.at(findModel);
                                        console.log(JSON.stringify(display));
                                        var newReportView = reportsListView.children.findByModel(display);
                                        newReportView.flash("bg-success animated fadeIn");
                                        AppManager.execute("alert:show",({type:"success",message:'Added: '+ model.get('username')}));
                                        //reports.fetch();
                                    },
                                    error: function (model, response) {
                                        console.log(JSON.stringify(response));
                                        if(response.statusText !== null || undefined){
                                            AppManager.triggerMethod("form:data:invalid", model.validationError);
                                            AppManager.execute("alert:show",({type:"warning",message:JSON.stringify(response.info)}));
                                        }
                                        //alert(JSON.stringify(response.statusText));
                                    }
                                });

                                if (!saveCheck) {
                                    view.triggerMethod("form:data:invalid", newReport.validationError);
                                }


                        });

                        AppManager.dialogRegion.show(view);
                    });
                });

              reportsListView.on("childview:report:show", function(childView, args){
                  console.log(args.model.get("_id"));
                AppManager.trigger("report:show", args.model.get("_id"));
              });

              reportsListView.on("childview:report:edit", function(childView, args){
                require(["apps/reports/edit/edit_view"], function(EditView){
                  var model = args.model;
                  var view = new EditView.Contact({
                    model: model
                  });

                  view.on("form:submit", function(data){
                      console.log('reports submitte data event: '+ JSON.stringify(data));

                      /************
                       *
                       *
                       *
                       *
                       */
                    if(model.save({roles:data},{wait:true})){
                         //  console.log(view);
                        model.set({roles:data});
                        //view.triggerMethod("initialize");
                        childView.render();
                            AppManager.execute("alert:show",({type:"success",message:"Roles Saved!!!"}));
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

              reportsListView.on("childview:report:delete", function(childView, args){
                  console.log(args.model.get('_id'));
                    if(confirm('Are you sure you want to Delete')){
                        //contact:
                        args.model.destroy();
                        AppManager.execute("alert:show",({type:"success",message:'Deleted '+args.model.attributes.username}));

                    }

              });

              AppManager.mainRegion.show(reportsListLayout);
            });
          });
        });
      }
    }
  });

  return AppManager.ReportsApp.List.Controller;
});


