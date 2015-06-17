define(["app",
        "tpl!apps/reports/show/templates/layout.html",
        "tpl!apps/reports/show/templates/top.html",
        "tpl!apps/reports/show/templates/missing.html",
        "tpl!apps/reports/show/templates/report.html",
        "tpl!apps/reports/show/templates/contract.html",
        "tpl!apps/reports/show/templates/tree_node.html",
        "tpl!apps/reports/show/templates/compositeHierarchy.html",
        "tpl!apps/reports/show/templates/category/guidList.html",
        "tpl!apps/reports/show/templates/category/hierSet.html",
        "tpl!apps/reports/show/templates/category/dpsList.html",
        "tpl!apps/reports/show/templates/category/costValues.html",
        "tpl!common/templates/footer.html",
        "vendor/moment", "jszip", "vendor/kendoUI/kendo.all.min","vendor/numeral"
    ],
    function (AppManager, layoutTpl, topTpl, missingTpl,
              reportTpl,contractTpl,nodeTpl,heirTpl,guidList,hierSet,
              dpsList,costValues,footerTpl, Moment, jszip) {
        AppManager.module("ReportsApp.Show.View", function (View, AppManager, Backbone, Marionette, $, _) {
            window.JSZip = jszip;
            View.Regions = Marionette.LayoutView.extend({
                template: layoutTpl,
                regions: {
                    TopPanel: "#top",
                    ReportPanel: "#report-panel",
                    ReviewPanel: "#review-panel",
                    HierPanel:"#hier-panel"
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
                    require(["common/views"], function (CommonViews) {
                        var FooterView = new CommonViews.Footer();
                        AppManager.footerRegion.show(FooterView);
                    });
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


            View.Footer = Marionette.ItemView.extend({
                template: footerTpl,
                initialize: function () {
                    this.$el.addClass('animated slideInUp');
                },
                onRender: function () {
                    var controlBtn = this.$('ul#button-control');
                    //controlBtn.css('border', 'thin solid yellow');
                    var html = '<li class="bg-info"><a class="js-save">Save</a></li><li class="bg-success"><a  class="js-submit">Submit</a></li>';
                    controlBtn.prepend(html);
                    console.log('!!!!!!!!!!!!!!  hit footer render');
                },
                events: {
                    "click a.js-save": "saveReport",
                    "click a.js-submit": "submitReport"
                },
                saveReport: function () {
                    console.log('hit footer js-saveReport');
                    AppManager.execute("alert:show",({type:"info",message:'Report Saved.'}));
                },
                submitReport: function () {
                    console.log('hit footer js-submitReport');
                    AppManager.execute("alert:show",({type:"success",message:'Report Submited.'}));
                }
            });
            /****/
            View.HeirarchyModelView = Marionette.ItemView.extend({
                template: nodeTpl,
                tagName:"ul",
                templateHelpers:function(){
                    return{
                        description:this.model.get('description'),
                        totalVal:this.model.get('totalVal'),
                        yearVals:this.model.get('yearVals')
                    }
                }
            });
            // The recursive tree view
            View.Hierarchy = Marionette.CompositeView.extend({
                template: nodeTpl,
                tagName: "ul",
               // childViewContainer:'li',
               // className:"animated fadeInUp",
                //className:"list-group",
                initialize: function(){
                   this.collection = this.model.nodes;
                },
                onRender: function(){
                    this.attachHtml = function(collectionView, childView, index){
                        collectionView.$el.find('li:first').append(childView.el);
                    };
                },
                templateHelpers:function(){
                    return{
                        description:this.model.get('description'),
                        totalVal:this.model.get('totalVal'),
                        yearVals:this.model.get('yearVals')
                    }
                }

            });


          View.HeirarchyRoot = Marionette.CollectionView.extend({
                tagName:'li',
                template:heirTpl,
                childView: View.Hierarchy,
                events:{
                    "click button.js-costs":"toggleCosts",
                    "click button.js-tree":"toggleSibling"
                },
                onRender:function(){

                },
                toggleCosts:function(e){
                    e.preventDefault();
                    console.log('hit toggleCosts ');
                    if( this.$el.find(e.currentTarget).parent().parent().find('table.costs').hasClass('hidden')){
                        this.$el.find(e.currentTarget).parent().parent().find('table.costs').toggleClass('hidden animated fadeIn');
                    }else{
                        this.$el.find(e.currentTarget).parent().parent().find('table.costs').toggleClass('hidden animated fadeIn');
                    }
                }/**,
                toggleSibling:function(e){
                    e.preventDefault();
                    console.log('hit toggleSibling ');
                    if( this.$el.find(e.currentTarget).parent().parent().nextAll('ul').hasClass('hidden') ){
                        this.$el.find(e.currentTarget).parent().parent().nextAll('ul').toggleClass('hidden').children('ul').fadeIn();//.siblings('ul').siblings('ul').slideUp()
                        e.stopPropagation();
                    }
                    else {
                        this.$el.find(e.currentTarget).parent().parent().nextAll('ul').toggleClass('hidden').children('ul').fadeOut();//.children('ul').siblings('ul').slideDown()
                        e.stopPropagation();
                    }
                      //  this.$el.find(e.currentTarget).parent().next('ul').toggleClass('hidden');
                }**/
            });


            View.Report = Marionette.ItemView.extend({
                template: reportTpl,
                events: {
                    "click button.js-tree": "treeClicked"
                },
                triggers:{
                    "click a.js-guid":"report:guidSet"
                },
                onRender: function () {

                },
                templateHelpers: function () {
                    //console.log(JSON.stringify(this.model));
                    return {
                        contractType:this.model.get('contractType').toUpperCase(),
                        notifyDate: Moment.utc(this.model.get('notifyDate')).format('YYYY/MM/DD')
                    }
                },
                treeClicked: function (e) {
                    e.preventDefault();
                    this.trigger("report:tree", this.model);
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



            View.GuidSet = Marionette.ItemView.extend({
                template: guidList,
                triggers: {
                    "click a.js-costs": "report:costValueSet",
                    "click a.js-run": "report:runid"
                },
                events:{
                    "click a.js-sap":"hierSet",
                    "click a.js-dps": "dpsSet",
                    "click a.js-hier": "hier"
                },
                initialize: function(){
                    this.title = this.collection.length+" Projects:";
                },
                onRender: function(){
                    if(this.options.generateTitle){
                        var $title = $("<p>", { text: this.title });
                        this.$el.prepend($title);
                    }
                },
                templateHelpers:function(){
                    var models = this.collection.models;
                    return {
                        guid: models,
                        Guidlength:this.collection.length
                    };
                },
                hierSet:function(e){
                    e.preventDefault();
                    var id =  this.$(e.currentTarget).data('id');
                    console.log(id);
                    this.trigger('report:HierSet',id)
                },
                dpsSet:function(e){
                    e.preventDefault();
                    var id =  this.$(e.currentTarget).data('id');
                    console.log(id);
                    this.trigger('report:dpsSet',id)
                },
                hier:function(e){
                    e.preventDefault();
                    var id =  this.$(e.currentTarget).data('id');
                    console.log(id);
                    this.trigger('report:hier',id)
                }



            });

            View.HierSet = Marionette.ItemView.extend({
                template: hierSet,
                triggers: {
                    // "click button.js-new": "notify:new"
                },
                events:{
                    "click a.js-sap":"guidList"
                },
                initialize: function(){
                    this.title = "HierSet: "+ this.collection.length;
                },
                onRender: function(){
                    if(this.options.generateTitle){
                        var $title = $("<p>", { text: this.title });
                        this.$el.prepend($title);
                    }
                },
                templateHelpers:function(){
                    var models = this.collection.models;
                    return {
                        guid: models,
                        hierlength:this.collection.length
                    };
                },
                guidList:function(e){
                    e.preventDefault();
                    var id =  this.$(e.currentTarget).data('id');
                    console.log(id);
                    this.trigger('report:dpsSet',id)
                }

            });
            View.DpsSet = Marionette.ItemView.extend({
                template: dpsList,
                triggers: {
                    // "click button.js-new": "notify:new"
                },
                events:{
                    "click a.js-sap":"guidList"
                },
                initialize: function(){
                    this.title = "MOD Structure: "+ this.collection.length;
                },
                onRender: function(){
                    if(this.options.generateTitle){
                        var $title = $("<p>", { text: this.title });
                        this.$el.prepend($title);
                    }
                },
                templateHelpers:function(){
                    var models = this.collection.models;
                    return {
                        guid: models,
                        dpslength:this.collection.length
                    };
                },
                guidList:function(e){
                    e.preventDefault();
                    var id =  this.$(e.currentTarget).data('id');
                    console.log(id);
                    //this.trigger('')
                }

            });

            (function($, kendo, _) {
                "use strict";

                // add a backbone namespace if we need it
                kendo.Backbone = kendo.Backbone || {};

                // BackboneTransport
                // -----------------
                //
                // Define a transport that will move data between
                // the kendo DataSource and the Backbone Collection
                var BackboneTransport = function(collection){
                    this._collection = collection;
                };

                // add basic CRUD operations to the transport
                _.extend(BackboneTransport.prototype, {

                    create: function(options) {
                        // increment the id
                        if (!this._currentId) { this._currentId = this._collection.length; }
                        this._currentId += 1;

                        // set the id on the data provided
                        var data = options.data;
                        data.id = this._currentId;

                        // create the model in the collection
                        this._collection.add(data);

                        // tell the DataSource we're done
                        options.success(data);
                    },

                    read: function(options) {
                        options.success(this._collection.toJSON());
                    },

                    update: function(options) {
                        // find the model
                        var model = this._collection.get(options.data.id);

                        // update the model
                        model.set(options.data);

                        // tell the DataSource we're done
                        options.success(options.data);
                    },

                    destroy: function(options) {
                        // find the model
                        var model = this._collection.get(options.data.id);

                        // remove the model
                        this._collection.remove(model);

                        // tell the DataSource we're done
                        options.success(options.data);
                    }
                });

                // kendo.backbone.BackboneDataSource
                // -----------------------------------

                // Define the custom data source that uses a Backbone.Collection
                // as the underlying data store / transport
                kendo.Backbone.DataSource = kendo.data.DataSource.extend({
                    init: function(options) {
                        var bbtrans = new BackboneTransport(options.collection);
                        _.defaults(options, {transport: bbtrans, autoSync: true});

                        kendo.data.DataSource.fn.init.call(this, options);
                    }
                });

                kendo.Backbone.HierarchicalDataSource = kendo.data.HierarchicalDataSource.extend({
                    init: function(options) {
                        var bbtrans = new BackboneTransport(options.collection);
                        _.defaults(options, {transport: bbtrans, autoSync: true});

                        kendo.data.HierarchicalDataSource.fn.init.call(this, options);
                    }
                });

            })($, kendo, _);

            View.CostValueView = Marionette.ItemView.extend({
                template:costValues,
                events:{
                    "click button.js-back":"backClicked"
                },
                initialize:function(){
                    this.title = this.collection.length+" Values:";
                },
                backClicked:function(e){
                    e.preventDefault();
                    this.trigger('back:clicked');
                },
                onRender:function(){
                    if(this.options.generateTitle){
                        var $title = $("<p>", { text: this.title });
                        this.$el.prepend($title);
                    }

                    this.$costData = new kendo.Backbone.DataSource({
                        collection: this.collection,
                        schema: {
                            model: {
                                // id: "NodeId",
                                fields: {
                                    RunId: {type: "string", editable: false},
                                    NodeId: {type: "string", editable: false},
                                    TpId: {type: "string", editable: false},
                                    CostValueType: {type: "string", editable: false},
                                    CurrencyType: { type: "string", editable: false},
                                    CostValue: {type: "number", editable: false},
                                    Currency: {type: "string", editable: false},
                                    TpDate: {type: "date", editable: false},
                                    SnDate: {type: "date", editable: false},
                                    Classification: {type: "number", editable: false}
                                }
                            }
                        },
                        // pageSize: 7,
                        /**group: {
                            field: "RunId", aggregates: [
                                { field: "CostValue", aggregate: "sum" },
                                { field: "RunId", aggregate: "count"}
                               //,
                               // { field: "UnitsOnOrder", aggregate: "average" },
                               // { field: "UnitsInStock", aggregate: "count" }
                            ]
                        },**/
                        aggregate: [
                            { field: "CostValue", aggregate: "sum" }
                            //   { field: "HireDate", aggregate: "max" }
                        ]
                    });
                    this.$el.kendoGrid({//kendoTreeList
                        toolbar: ["excel"],
                        excel: {
                            fileName: "CostValues.xlsx",
                            //    fileName: "CostValues_"+Moment.unix()+".xlsx",
                            //proxyURL: "http://demos.telerik.com/kendo-ui/service/export",
                            //proxyURL: "http://localhost:8000",
                            filterable: true
                        },
                        dataSource: this.$costData,
                        pageSize: (this.collection.length / 7),
                        height: 400,
                        sortable: true,
                        scrollable:true,
                        //pageable: true,
                        groupable: true,
                        filterable: true,
                        //columnMenu: true,
                        reorderable: true,
                        resizable: true,
                        columns: [
                            { width: 40, field: "RunId", title: "Run Id" },
                            { width: 40, field: "NodeId", title: "Node Id" },
                            { width: 40, field: "TpId", title: "Tp Id" },
                            { width: 20, field: "CostValueType", title: "CostValue Type" },
                            { width: 20, field: "CurrencyType", title: "Currency Type" },
                            { width: 50, field: "CostValue", title: "Cost Value",
                                footerTemplate: "#= sum # Amount"},
                            //  aggregates: ["max","sum"],groupHeaderTemplate: "Value: #= value  (Total: #= sum#)" },
                            { width: 40, field: "Currency", title: "Currency" },
                            { width: 40, field: "TpDate", title: "Tp Date",format: "{0:YYYY/MM/DD}"},
                            { width: 40, field: "SnDate", title: "Sn Date",format: "{0:YYYY/MM/DD}"//,format: "{0:YYYY/MM/DD}"
                            },
                            { width: 50, field: "Classification", title: "Classification" }
                            //{ command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }
                        ]
                        // editable: "inline"
                    });


                }

            });


        });

        return AppManager.ReportsApp.Show.View;
    });
