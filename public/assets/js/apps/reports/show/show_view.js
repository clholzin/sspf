define(["app",
        "tpl!apps/reports/show/templates/layout.html",
        "tpl!apps/reports/show/templates/top.html",
        "tpl!apps/reports/show/templates/missing.html",
        "tpl!apps/reports/show/templates/report.html",
        "tpl!apps/reports/show/templates/contract.html",
        "tpl!apps/reports/show/templates/tree_node.html",
        "tpl!apps/reports/show/templates/compositeHierarchy.html",
        "vendor/moment", "jszip", "vendor/numeral"],
    function (AppManager, layoutTpl, topTpl, missingTpl,
              reportTpl,contractTpl,nodeTpl,heirTpl, Moment, jszip) {
        AppManager.module("ReportsApp.Show.View", function (View, AppManager, Backbone, Marionette, $, _) {
            window.JSZip = jszip;
            View.Regions = Marionette.LayoutView.extend({
                template: layoutTpl,
                regions: {
                    TopPanel: "#top",
                    ReportPanel: "#report-panel",
                    ReviewPanel: "#review-panel"
                },
                onShow: function () {
                    /**  var parent = this.$el.parent().parent();
                     parent.css('background-image','url(./assets/img/Picture1.jpg)');
                     parent.css('background-size','cover');
                     parent.css('background-repeat','no-repeat');
                     parent.css('background-attachment','fixed');**/
                },
                onBeforeDestroy: function () {
                    /** var parent = this.$el.parent().parent();
                     parent.removeAttr('style');**/
                },
                onRender: function () {

                }
            });
            View.Top = Marionette.ItemView.extend({
                template: topTpl,
                triggers: {
                    //"click button.js-new": "notify:new"
                },
                events: {
                    //"click li.report": "runFilter"
                }
            });
            View.MissingReport = Marionette.ItemView.extend({
                template: missingTpl
            });

            View.HeirarchyModelView = Marionette.ItemView.extend({
                template: nodeTpl,
                 tagName:"li",
                templateHelpers:function(){
                    return{
                        nodeName:this.model.get('nodeName')
                    }
                }
            });
            // The recursive tree view
            View.Hierarchy = Marionette.CompositeView.extend({
                //template: heirTpl,
                template: nodeTpl,
                //childView:View.HeirarchyModelView,
                tagName: "ul",
                className:"list-group",
                initialize: function(){
                    var self = this;
                    // grab the child collection from the parent model
                    // so that we can render the collection as children
                    // of this parent node
                    //_.each(this.model.nodes,function(item){   });
                       // self.collection = self.model.nodes;

                   this.collection = this.model.nodes;
                },
                onRender: function(){
                    this.attachHtml = function(collectionView, childView, index){
                        collectionView.$el.find('li:first').append(childView.el);
                    }
                },
                templateHelpers:function(){
                    return{
                        description:this.model.get('description'),
                        totalVal:this.model.get('totalVal'),
                        yearVals:this.model.get('yearVals')
                    }
                }
               /** attachHtml: function(collectionView, childView){
                    // ensure we nest the child list inside of
                    // the current list item
                    console.log(collectionView);
                    collectionView.$("li:first").append(childView.el);
                },**/
               /** templateHelpers:function(){
                        return{
                            nodeName:this.model.get('nodeName')
                        }
                }**/

            });


            View.HeirarchyRoot = Marionette.CollectionView.extend({
                // tagName:'ul',
               // className:'bg-white',
                childView: View.Hierarchy
            });


            View.Report = Marionette.ItemView.extend({
                template: reportTpl,
                events: {
                    "click button.js-tree": "treeClicked"
                },
                onRender: function () {

                },
                templateHelpers: function () {
                    console.log(JSON.stringify(this.model));
                    return {
                        contractType:this.model.get('contractType').toUpperCase(),
                        notifyDate: Moment.utc(this.model.get('notifyDate')).format('YYYY/MM/DD')
                    }
                },
                treeClicked: function (e) {
                    e.preventDefault();
                    this.trigger("report:tree", this);
                }
            });

            View.Contract = Marionette.ItemView.extend({
                template: contractTpl,
                events: {
                    //  "click a.js-edit": "editClicked"
                },
                onRender: function () {
                },
                templateHelpers:function(){
                    this.$model = this.model.attributes;
                    this.$pricing = this.model.attributes.pricing;
                    return {
                        startDate:Moment.utc(this.$model.startDate).format('YYYY/MM/DD'),
                        endDate:Moment.utc(this.$model.endDate).format('YYYY/MM/DD'),
                        created_at:Moment.utc(this.$model.created_at).format('YYYY/MM/DD'),
                        updated_at:Moment.utc(this.$model.updated_at).fromNow(),
                        contract:{amount:numeral(this.$model.contract.amount).format('$0,0.00')},
                        pricing:{
                              targetPricing:numeral(this.$pricing.targetPricing).format('$0,0.00'),
                              volDrivenPricing:numeral(this.$pricing.volDrivenPricing).format('$0,0.00'),
                              estBasedFee:numeral(this.$pricing.estBasedFee).format('$0,0.00'),
                              costPlusPricing:numeral(this.$pricing.costPlusPricing).format('$0,0.00'),
                              fixedPricing:numeral(this.$pricing.fixedPricing).format('$0,0.00'),
                              firmPricing:numeral(this.$pricing.firmPricing).format('$0,0.00')
                        },
                        username: this.$model.user.username
                    }
                }
            });
        });

        return AppManager.ReportsApp.Show.View;
    });
