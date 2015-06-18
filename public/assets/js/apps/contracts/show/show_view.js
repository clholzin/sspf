define(["app",
        "tpl!apps/contracts/show/templates/layout.html",
        "tpl!apps/contracts/show/templates/left_side.html",
        "tpl!apps/contracts/show/templates/left_item.html",
        "tpl!apps/contracts/show/templates/left_side_top.html",
        "tpl!apps/contracts/show/templates/right_side.html",
        "tpl!apps/contracts/show/templates/right_item.html",
        "tpl!apps/contracts/show/templates/missing.html",
        "tpl!apps/contracts/show/templates/contractView.html",
        "tpl!apps/contracts/show/templates/exportView.html",
        "tpl!apps/contracts/show/templates/category/guidList.html",
        "tpl!apps/contracts/show/templates/category/hierSet.html",
        "tpl!apps/contracts/show/templates/category/dpsList.html",
        "apps/contracts/common/views",
        "vendor/moment","jszip","vendor/kendoUI/kendo.all.min",
        "vendor/numeral","backbone.syphon"
            ],//"vendor/kendoUI/kendo.all.min",
    function(AppManager,layoutTpl,leftSide,leftItem,topLeft,rightSide,
             rightItem, missingTpl,contractView,exportView,guidList,hierSet,dpsList,CommonViews,Moment,
             jszip){
        AppManager.module("ContractsApp.Show.View", function(View, AppManager, Backbone, Marionette, $, _){

            View.Regions = Marionette.LayoutView.extend({
                template: layoutTpl,
                regions: {
                    leftRegion: "#left-panel",
                    mainRegion: "#main-panel",
                    rightRegion: "#right-panel",
                    topLeftRegion:"#top-left-panel"
                },
                onShow:function(){
                    var parent = this.$el.parent();
                    parent.removeClass('fadeIn').addClass('fadeIn');
                    if(parent.hasClass('container')){
                        parent.removeClass('container');
                    }
                    if(parent.hasClass('container-fluid')){
                        parent.removeClass('container-fluid');
                    }
                },
                onBeforeDestroy :function(){
                    var parent = this.$el.parent();
                    parent.addClass('fadeIn').removeClass('fadeIn');
                    parent.addClass('container');
                },
                onRender:function(){
                }
            });

            View.MissingContract = Marionette.ItemView.extend({
                template: missingTpl
            });

            View.NotifyNew = CommonViews.NotifyForm.extend({
                initialize: function(){
                    this.title = "Create:";
                },
                onRender: function(){
                    if(this.options.generateTitle){
                        var $title = $("<p>", { text: this.title });
                        this.$el.prepend($title);
                    }
                    this.$(".js-submit").text("New");
                }

            });
            View.NotifyEdit = CommonViews.NotifyForm.extend({
                initialize: function(){
                    this.title = "Edit:";
                },
                onRender: function(){
                    if(this.options.generateTitle){
                        var $title = $("<p>", { text: this.title });
                        this.$el.prepend($title);
                    }
                this.$(".js-submit").text("Update").removeClass('bnt-default').addClass('btn-success');

                var findSelect = this.model.get('contractType');
                    //console.log(findSelect);
                    var options = this.$('form').find('option');
                    //console.log(options);
                    options.each(function(index, element){
                        //console.log(index+': '+element);
                        if( $(element).val() === findSelect){
                            $(element).attr('selected','selected');
                            return false;
                        }
                    });

                }
            });

            View.TopLeftView = Marionette.ItemView.extend({
              //  el:'#top-left-panel',
                template: topLeft,
                triggers: {
                    "click button.js-new": "notify:new"
                },
                events:{
                    "click li.report": "runFilter",
                    'click .js-filter-toggle':'showFilter'
                },
                runFilter:function(e){
                    e.preventDefault();
                    var val = this.$(e.currentTarget).data('id');
                    console.log('hit TopLeftView trigger filter '+val);
                    if(val !== undefined){
                        this.trigger('notify:filterByType',val);
                    }
                },
                showFilter:function(e){
                e.preventDefault();
                this.$el.find('.js-notify-controls').toggleClass('hidden');
                this.$el.find('#filter').toggleClass('hidden fadeInLeft fadeInRight')
               }

            });


            View.Left = Marionette.ItemView.extend({
                tagName: "li",
                template: leftItem,
                triggers: {
                    //"click td a.js-show": "notify:show",
                    "click button.js-delete": "notify:delete"
                },
                events: {
                    "click #notify-edit": "editClicked",
                    "click button#btnPopover": "actions",
                    "hover a#infotoshow": "info",
                    "click a":"active",
                    "click button.js-report":'report'
                },
                onRender:function(){
                    this.trigger("action:popover",this);
                },
                serializeData:function(){
                    return {
                        "_id":this.model.get('_id'),
                        "contractType": this.model.get('contractType'),
                        "dateNotify": Moment.utc(this.model.get('dateNotify')).format('YYYY-MM-DD'),
                        "timeTill":Moment.utc(this.model.get('dateNotify')).fromNow()
                    }
                },
                active:function(e){
                    e.preventDefault();
                    this.$el.toggleClass("active");
                },
                info:function(e){
                    e.preventDefault();
                    this.$('a#infotoshow').tooltip();
                },
                actions:function(e){
                    e.preventDefault();
                     //$('[data-toggle="popover"]').popover();
                     this.trigger("action:popover",this);
                },
                report:function(e){
                    e.preventDefault();
                   // var id = this.$(e.currentTarget).data('id');
                    this.trigger('action:report',this);
                },
                editClicked: function(e){
                    e.preventDefault();
                    this.trigger("notify:edit", this);
                },
                flash: function(cssClass){
                    var $view = this.$el;
                    $view.hide().toggleClass(cssClass).fadeIn(function(){
                        setTimeout(function(){
                            $view.toggleClass(cssClass)
                        }, 2000);
                    });
                },

                highlightName: function(e){
                    this.$el.toggleClass("warning");
                },

                remove: function(){
                    var self = this;
                    this.$el.fadeOut(function(){
                        Marionette.ItemView.prototype.remove.call(self);
                    });
                }
            });


            View.LeftMenu = Marionette.CompositeView.extend({
                tagName: "ul",
                className: "nav nav-sidebar animated slideInLeft",
                template: leftSide,
                emptyView: View.MissingContract,
                childView:  View.Left,
                emptyViewContainer: "ul",
                //childViewContainer: "ul",
                events:{
                    'click option':'filterByReport'
                },
                initialize: function(){
                   this.listenTo(this.collection, "reset", function(){
                        this.attachHtml = function(collectionView, childView, index){
                            collectionView.$el.append(childView.el);
                        };
                    });
                },
                onRenderCollection: function(){
                    this.attachHtml = function(collectionView, childView, index){
                        collectionView.$el.append(childView.el);
                    };
                },
                onRender:function(options){
                   // console.log(options);
                    //$('.nav-sidebar ul.animated').toggleClass('fadeInLeft fadeInRight');
                    this.$previous = options.previousModels;
                    var self = this;
                    $(document).ready(function(){
                        self.$el.popover();
                        self.$el.tooltip();
                    });
                    //_.sortBy(self.collection.models, 'cid');
                },
                filterByReport:function(filtered){
                    console.log('hit filter report method '+ JSON.stringify(filtered.models));
                   // console.log(JSON.stringify(revisedObj));
                   // collection.reset(revisedObj);
                }
            });


            View.Right = Marionette.ItemView.extend({
                initialize:function(){
                },
                template: rightItem,
                events: {
                    "click button.js-new": "addComment",
                    "click button.js-delete":"removeComment",
                    'enter input#comments-body': 'updateOnEnter'
                },
                templateHelpers:function(){
                var comments = this.model.get("comments");
                    var count = comments.length;
                    var sortedObject = _.sortBy(comments, function(val, key, object) {
                        return key * 1;
                    });
                return {
                    comments:comments === undefined ? false :sortedObject,
                    date_created:Moment().format('YYYY/MM/DD'),
                    username:this.model.get('user').username,
                    "count": count <= 1 ? count+' Comment':count+' Comments'
                    };
                },
                addComment:function(e){
                    e.preventDefault();
                    var data = Backbone.Syphon.serialize(this);
                    console.log(JSON.stringify(data));
                    this.$('input#comments-body').focus().val('');
                    if(data.body === ''){
                       return AppManager.execute("alert:show",({
                        type: "warning",
                        message: "Comment can't be blank."
                    }));}
                    this.trigger("comment:add",data);
                },
                removeComment:function(e){
                    e.preventDefault();
                    var self = this;
                    var id =  this.$(e.currentTarget).data('id');
                    console.log(JSON.stringify(id));
                    if(confirm('Are you sure you want to Delete') === false){
                        return;
                    }

                   var objtoDelete = $.grep(self.model.get('comments'), function(item,index) {
                        return index !==  id;
                    });
                    console.log(JSON.stringify(objtoDelete));
                    self.model.save({'comments':objtoDelete});
                    self.render();
                    AppManager.execute("alert:show",({
                        type: "info",
                        message: "Removed comment"
                    }));
                    self.render();
                   // target.parent().find('#'+id).fadeOut(500,function(){this.remove()});
                },
                // If you hit `enter`, we're through editing the item.
                updateOnEnter: function (e) {
                    e.preventDefault();
                    if (e.which === ENTER_KEY) {
                        this.addComment();
                    }
                },
                flash: function(cssClass){
                    var $view = this.$el;
                    $view.hide().toggleClass(cssClass).fadeIn(function(){
                        setTimeout(function(){
                            $view.toggleClass(cssClass)
                        }, 2000);
                    });
                }

            });

           /** View.RightMenu = Marionette.CollectionView.extend({
                //tagName: "div",
                //className: "panel panel-default",
                template: rightSide,
                emptyView: View.MissingContract,
                childView:  View.Right,
                childViewContainer: "div#comments",
                emptyViewContainer: "div#comments",
                templateHelpers:function(){
                    var comments = this.collection.get("comments");
                    var count = comments.length;
                    return {
                        "count": count <= 1 ? count+' Comment':count+' Comments'
                    };
                },
                initialize: function(){
                    this.listenTo(this.collection, "change", function(){
                        this.attachHtml = function(collectionView, childView, index){
                            collectionView.$el.append(childView.el);
                        }
                    });
                },

                onRenderCollection: function(){
                    this.attachHtml = function(collectionView, childView, index){
                        collectionView.$el.prepend(childView.el);
                    }
                }
            });**/


            View.Contract = Marionette.ItemView.extend({
                template: contractView,
                className:'contracts-details',
                na:'N/A',
                events: {
                    'click #contract-view-tabs a':'changeTab',
                    "click a.js-edit": "editClicked",
                    'dblclick .js-dbclick': 'Edit',
                    'click .js-cancel': 'Cancel',
                    'click .js-submit': 'submitClicked',
                    "click a.js-back":"backClicked",
                    "click a.js-export":"exportClicked",

                    "click .js-business":"addBusiness",
                    "click .js-removeBusiness":"removeBusiness",
                    'enter input#business-units': 'updateOnEnter',

                    "click a.circleBtn":"tab"
                },
                triggers:{
                    "click a.js-guid":"contract:guidSet"
                },
                initialize: function () {
                    this.listenTo(this.model, 'change', this.render);
                    //this.listenTo(this.model, 'destroy', this.remove);
                    //this.listenTo(this.model, 'visible', this.toggleVisible);
                },
                onRender:function(){
                    this.$list = this.$('.js-dbclick');
                    this.$form = this.$('form.hidden');
                },
                tab:function(e){
                    this.$(e.currentTarget).parent().children().removeClass('btn-primary').addClass('btn-default');
                    this.$(e.currentTarget).addClass('btn-primary').removeClass('btn-default');
                },
                templateHelpers:function(){
                    var pricing = this.model.get('pricing');
                        return {
                        "_id": this.model.get('_id'),
                        "title":this.model.get('title'),
                        "value":numeral(this.model.get('contract').amount).format('$0,0.00'),
                        "description":{
                            'body':this.model.get('description').body
                        },
                        "startDate":Moment.utc(this.model.get('startDate')).format('YYYY/MM/DD'),
                        "endDate":Moment.utc(this.model.get('endDate')).format('YYYY/MM/DD'),
                        "updated_at": Moment.utc(this.model.get('updated_at')).fromNow(),
                        "date_created" : Moment.utc(this.model.get('meta').date_created).format('YYYY/MM/DD'),
                         "businessUnitNames": (this.model.get('businessUnit') != undefined ? this.model.get('businessUnit') : this.na),
                          "fixedPricing":numeral(pricing.fixedPricing).format('$0,0.00'),
                            "estBasedFee":numeral(pricing.estBasedFee).format('$0,0.00'),
                            "targetPricing":numeral(pricing.targetPricing).format('$0,0.00'),
                            "costPlusPricing":numeral(pricing.costPlusPricing).format('$0,0.00'),
                            "firmPricing":numeral(pricing.firmPricing).format('$0,0.00'),
                            "volDrivenPricing":numeral(pricing.volDrivenPricing).format('$0,0.00'),

                            "fixedPricing_edit":numeral(pricing.fixedPricing).format('0.00'),
                            "estBasedFee_edit":numeral(pricing.estBasedFee).format('0.00'),
                            "targetPricing_edit":numeral(pricing.targetPricing).format('0.00'),
                            "costPlusPricing_edit":numeral(pricing.costPlusPricing).format('0.00'),
                            "firmPricing_edit":numeral(pricing.firmPricing).format('0.00'),
                            "volDrivenPricing_edit":numeral(pricing.volDrivenPricing).format('0.00')

                    };
                },
                changeTab:function(){
                    this.$el.tab('show');

                },
                // Switch this view into `"editing"` mode, displaying the input field.
                Edit: function (e) {
                    e.preventDefault();
                    this.$list.toggleClass('hidden');
                    this.$form.toggleClass('hidden');
                   // this.$el.addClass('editing');
                    this.$form.focus();
                },
                editClicked: function(e){
                    e.preventDefault();
                    this.trigger("contract:edit", this.model);
                },
                Cancel: function () {
                    this.$list.toggleClass('hidden');
                    this.$form.toggleClass('hidden');
                    this.flash("animated fadeIn");
                },
                submitClicked: function(e){
                    e.preventDefault();
                   // var data = Backbone.Syphon.serialize(this);
                    var data = Backbone.Syphon.serialize($("form#pricing")[0]);
                    console.log('Submited data: '+JSON.stringify(data));
                    this.trigger("price:update",data);
                    this.flash("animated fadeIn bg-success");
                },
                flash: function(cssClass){
                    var $view = this.$list;
                    $view.hide().toggleClass(cssClass).fadeIn(function(){
                        setTimeout(function(){
                            $view.toggleClass(cssClass)
                        }, 2000);
                    });
                },
                exportClicked:function(e){
                    e.preventDefault();
                    this.trigger("contract:export", this.model);
                },
                backClicked: function(e){
                    e.preventDefault();
                    this.trigger("contract:list");
                    console.log('hit back')
                },
                addBusiness:function(e){
                    e.preventDefault();
                    //var data = Backbone.Syphon.serialize(this);
                    var data = Backbone.Syphon.serialize($("form#businessUnit")[0]);
                    console.log(JSON.stringify(data));
                    this.$('#businessUnit input#business-units').focus().val('');
                    if(data.body === ''){
                        return AppManager.execute("alert:show",({
                            type: "warning",
                            message: "Comment can't be blank."
                        }));}
                    this.trigger("businessUnit:add",data);
                },
                removeBusiness:function(e){
                    e.preventDefault();
                    var self = this;
                    var id =  this.$(e.currentTarget).data('id');
                    console.log(JSON.stringify(id));
                    if(confirm('Are you sure you want to Delete') === false){
                        return;
                    }

                    var objtoDelete = $.grep(self.model.get('businessUnit'), function(item,index) {
                        return index !==  id;
                    });
                    console.log(JSON.stringify(objtoDelete));
                    self.model.save({'businessUnit':objtoDelete});
                    self.render();
                    AppManager.execute("alert:show",({
                        type: "info",
                        message: "Removed comment"
                    }));
                    self.render();
                    // target.parent().find('#'+id).fadeOut(500,function(){this.remove()});
                },
                // If you hit `enter`, we're through editing the item.
                updateOnEnter: function (e) {
                    e.preventDefault();
                    if (e.which === ENTER_KEY) {
                        this.addBusiness();
                    }
                }
            });





            View.GuidSet = Marionette.ItemView.extend({
                template: guidList,
                triggers: {
                     "click a.js-costs": "contract:costValueSet",
                     "click a.js-run": "contract:runid"
                },
                events:{
                    "click a.js-sap":"HierSetList",
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
                HierSetList:function(e){
                    e.preventDefault();
                    var id =  this.$(e.currentTarget).data('id');
                    console.log(id);
                    this.trigger('contract:HierSet',id)
                },
                dpsSet:function(e){
                    e.preventDefault();
                    var id =  this.$(e.currentTarget).data('id');
                    console.log(id);
                    this.trigger('contract:dpsSet',id)
                },
                hier:function(e){
                    e.preventDefault();
                    var id =  this.$(e.currentTarget).data('id');
                    console.log(id);
                    this.trigger('contract:hier',id)
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
                    this.title = "Hier set: "+ this.collection.length;
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
                     this.trigger('contract:dpsSet',id)
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


            window.JSZip = jszip;



            View.CostValueView = Marionette.ItemView.extend({
                template:exportView,
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


            View.ContractExport = Marionette.ItemView.extend({
                template:exportView,
                events:{
                    "click button.js-back":"backClicked"
                },
                initialize:function(){
                    this.title = this.collection.length+" People:";
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

                   this.$exportData = new kendo.Backbone.DataSource({
                       collection: this.collection,
                       schema: {
                           model: {
                               id: "Persnumber",
                               fields: {
                                   Persnumber:{type: "number", editable: false},
                                   NameFirst: {type: "text", editable: false, required: true},
                                   NameLast: {type: "text", editable: false, required: true},
                                   SmtpAddr: {type: "text", editable: true, required: true}
                                   // id: {type: "number", editable: false},
                                   // done: {type: "boolean", editable: true},
                                   // description: {type: "text", editable: true, required: true}
                               }
                           }
                       }
                   });
                   this.$el.kendoGrid({
                       toolbar: ["excel"],
                       excel: {
                           fileName: "URS_SetList.xlsx",
                           //proxyURL: "http://demos.telerik.com/kendo-ui/service/export",
                           //proxyURL: "http://localhost:8000",
                           filterable: true
                       },
                       dataSource: this.$exportData,
                       //pageSize: this.collection.length,
                       height: 450,
                       sortable: true,
                       pageable: true,
                       groupable: true,
                       filterable: true,
                       columnMenu: true,
                       reorderable: true,
                       resizable: true,
                       columns: [
                           { width: 65, field: "Persnumber", title: "ID" },
                           { width: 100, field: "NameFirst", title: "FirstName" },
                           { width: 100, field: "NameLast", title: "LastName" },
                           { width: 65, field: "SmtpAddr", title: "Email" }
                           //{ command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }
                       ]
                      // editable: "inline"
                   });


               }

            });



        });

        return AppManager.ContractsApp.Show.View;
    });
