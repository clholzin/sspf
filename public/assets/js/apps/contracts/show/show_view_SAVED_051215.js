define(["app",
        "tpl!apps/contracts/show/templates/layout.html",
        "tpl!apps/contracts/show/templates/left_side.html",
        "tpl!apps/contracts/show/templates/left_item.html",
        "tpl!apps/contracts/show/templates/left_side_top.html",
        "tpl!apps/contracts/show/templates/right_side.html",
        "tpl!apps/contracts/show/templates/right_item.html",
        "tpl!apps/contracts/show/templates/missing.html",
        "tpl!apps/contracts/show/templates/view.html",
        "tpl!apps/contracts/show/templates/exportView.html",
        "vendor/moment","apps/contracts/common/views",
        "vendor/kendoUI/kendo.all.min"
            ],
    function(AppManager,layoutTpl,leftSide,leftItem,topLeft,rightSide,
             rightItem, missingTpl, mainView,exportView,Moment,CommonViews,kendo){
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
                    parent.removeClass('container').addClass('fluid-container');
                },
                onBeforeDestroy :function(){
                    var parent = this.$el.parent();
                    parent.addClass('fadeIn').removeClass('fadeIn');
                    parent.removeClass('fluid-container').addClass('container');
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
                    "hover a#infotoshow": "info"
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
                info:function(e){
                    e.preventDefault();
                    this.$('a#infotoshow').tooltip();
                },
                actions:function(e){
                    e.preventDefault();
                     //$('[data-toggle="popover"]').popover();
                     this.trigger("action:popover",this);
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
                className: "nav nav-sidebar",
                template: leftSide,
                emptyView: View.MissingContract,
                childView:  View.Left,
                emptyViewContainer: "ul",
                //childViewContainer: "ul",
                onRender:function(){
                    var self = this;
                    $(document).ready(function(){
                        self.$el.popover();
                        self.$el.tooltip();
                    });
                    //_.sortBy(self.collection.models, 'cid');
                },
                initialize: function(e){
                   this.listenTo(this.collection, "reset", function(){
                        this.attachHtml = function(collectionView, childView, index){
                            collectionView.$el.append(childView.el);
                            //collectionView.$el.popover();
                        }
                    });
                },
                onRenderCollection: function(){
                    this.attachHtml = function(collectionView, childView, index){
                        collectionView.$el.prepend(childView.el);
                    }
                }
            });


            View.Right = Marionette.ItemView.extend({
                template: rightItem,
                templateHelpers:function(){
                var comments = this.model.get("comments");
                    var count = comments.length;
                return {
                    "comments":comments,
                    "count": count <= 1 ? count+' Comment':count+' Comments'
                    };
                },
                serializeData:function(){
                    return{
                        comments:{
                            date: Moment.utc(this.model.get('comments').date).format('YYYY MM DD')
                        }
                    };
                },
                triggers: {
                    "click button.js-new": "comment:new"
                },
                events: {
                    "submit button.js-edit": "editComment"
                }
            });

            View.RightMenu = Marionette.CompositeView.extend({
                tagName: "div",
                className: "panel panel-default",
                template: rightSide,
                emptyView: View.MissingContract,
                childView:  View.Right,
                childViewContainer: "#panel",
                emptyViewContainer: "#panel",
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
            });


            View.Contract = Marionette.ItemView.extend({
                template: mainView,
                na:'N/A',
                events: {
                    "click a.js-edit": "editClicked",
                    "click a.js-back":"backClicked",
                    "click a.js-export":"exportClicked"
                },
                initialize: function(){

                },

                templateHelpers:function(){

                        return {
                        "_id": this.model.get('_id'),
                        "title":this.model.get('title'),
                        "startDate":Moment.utc(this.model.get('startDate')).format('YYYY-MM-DD'),
                        "endDate":Moment.utc(this.model.get('endDate')).format('YYYY-MM-DD'),
                        "updated_at": Moment.utc(this.model.get('updated_at')).format('YYYY-MM-DD'),
                        "date_created" : Moment.utc(this.model.get('meta').date_created).format('L'),
                         "businessUnitNames": (this.model.get('businessUnit') != undefined ? this.model.get('businessUnit') : this.na),
                            "fixedPricing":(this.model.get('pricing').fixedPricing != undefined ? this.model.get('pricing').fixedPricing.toFixed(2) : this.na),
                            "estBasedFee":(this.model.get('pricing').estBasedFee != undefined ? this.model.get('pricing').estBasedFee.toFixed(2) : this.na),
                            "targetPricing":(this.model.get('pricing').targetPricing != undefined ? this.model.get('pricing').targetPricing.toFixed(2) : this.na),
                            "costPlusPricing":(this.model.get('pricing').costPlusPricing != undefined ? this.model.get('pricing').costPlusPricing.toFixed(2) : this.na),
                            "firmPricing":(this.model.get('pricing').firmPricing != undefined ? this.model.get('pricing').firmPricing.toFixed(2) : this.na),
                            "volDrivenPricing":(this.model.get('pricing').volDrivenPricing != undefined ? this.model.get('pricing').volDrivenPricing.toFixed(2) : this.na)

                    };
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
                editClicked: function(e){
                    e.preventDefault();
                    this.trigger("contract:edit", this.model);
                }
            });











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
                   // options.success(this._collection.toJSON());
                    options.success(JSON.stringify(this._collection));
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

            kendo.Backbone = kendo.Backbone || {};

            kendo.Backbone.DataSource = kendo.data.DataSource.extend({
                init: function(options) {
                    var bbtrans = new BackboneTransport(options.collection);
                    _.defaults(options, {transport: bbtrans, autoSync: true});

                    kendo.data.DataSource.fn.init.call(this, options);
                }
            });



            View.ContractExport = Marionette.ItemView.extend({
                template:exportView,
                templateHelpers:function() {
                return {
                    "_id": this.model.get('_id'),
                    "title": this.model.get('title'),
                    "startDate": Moment.utc(this.model.get('startDate')).format('YYYY-MM-DD'),
                    "endDate": Moment.utc(this.model.get('endDate')).format('YYYY-MM-DD'),
                    "updated_at": Moment.utc(this.model.get('updated_at')).format('YYYY-MM-DD'),
                    "date_created": Moment.utc(this.model.get('meta').date_created).format('L'),
                    "businessUnitNames": (this.model.get('businessUnit') != undefined ? this.model.get('businessUnit') : this.na),
                    "fixedPricing": (this.model.get('pricing').fixedPricing != undefined ? this.model.get('pricing').fixedPricing.toFixed(2) : this.na),
                    "estBasedFee": (this.model.get('pricing').estBasedFee != undefined ? this.model.get('pricing').estBasedFee.toFixed(2) : this.na),
                    "targetPricing": (this.model.get('pricing').targetPricing != undefined ? this.model.get('pricing').targetPricing.toFixed(2) : this.na),
                    "costPlusPricing": (this.model.get('pricing').costPlusPricing != undefined ? this.model.get('pricing').costPlusPricing.toFixed(2) : this.na),
                    "firmPricing": (this.model.get('pricing').firmPricing != undefined ? this.model.get('pricing').firmPricing.toFixed(2) : this.na),
                    "volDrivenPricing": (this.model.get('pricing').volDrivenPricing != undefined ? this.model.get('pricing').volDrivenPricing.toFixed(2) : this.na)
                };
                },
               onRender:function(){
                   var exportData = new kendo.Backbone.DataSource({
                       collection: this.model.attributes,
                       schema: {
                           model: {
                               id: "id",
                               fields: {
                                   "id": {type: "number", editable: false},
                                   "title": {type: "text", editable: true, required: true},
                                   "startDate": {type: "number", editable: false},
                                   "endDate": {type: "number", editable: false},
                                   "updated_at": {type: "number", editable: false},
                                   "date_created": {type: "number", editable: false}
                                  /** "fixedPricing": {type: "number", editable: false},
                                   "estBasedFee": {type: "number", editable: false},
                                   "targetPricing": {type: "number", editable: false},
                                   "costPlusPricing": {type: "number", editable: false},
                                   "firmPricing": {type: "number", editable: false},
                                   "volDrivenPricing": {type: "number", editable: false}
                                   // id: {type: "number", editable: false},
                                   // done: {type: "boolean", editable: true},
                                   // description: {type: "text", editable: true, required: true}
                               **/  }
                           }
                       }
                   });
                   this.$el.kendoGrid({
                       toolbar: ["excel"],
                       excel: {
                           fileName: "Kendo UI Grid Export.xlsx",
                           proxyURL: "http://demos.telerik.com/kendo-ui/service/export",
                           //proxyURL: "http://localhost:8000",
                           filterable: true
                       },
                       dataSource: exportData,
                       sortable: true,
                       pageable: true,
                       groupable: true,
                       filterable: true,
                       columnMenu: true,
                       reorderable: true,
                       resizable: true,
                       columns: [
                           { width: 40, field: "id", title: "ID" },
                           { width: 40, field: "title", title: "Name" },
                           { width: 40, field: "startDate", title: "startDate" },
                           { width: 40, field: "endDate", title: "endDate" },
                           { width: 40, field: "fixedPricing", title: "fixedPricing" }
                       ]
                   });


               }

            });



        });

        return AppManager.ContractsApp.Show.View;
    });
