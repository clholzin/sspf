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
        "jszip","backbone.syphon","vendor/kendoUI/kendo.all.min","kendo.backbone"
            ],
    function(AppManager,layoutTpl,leftSide,leftItem,topLeft,rightSide,
             rightItem, missingTpl, mainView,exportView,Moment,
             CommonViews,jszip){
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
                    "hover a#infotoshow": "info",
                    "click a":"active"
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
                template: mainView,
                na:'N/A',
                events: {
                    "click a.js-edit": "editClicked",
                    'dblclick .js-dbclick': 'Edit',
                    'click .js-cancel': 'Cancel',
                    'click .js-submit': 'submitClicked',
                    "click a.js-back":"backClicked",
                    "click a.js-export":"exportClicked"
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
                templateHelpers:function(){

                        return {
                        "_id": this.model.get('_id'),
                        "title":this.model.get('title'),
                        "contract":this.model.get('contract'),
                        "description":{
                            'body':this.model.get('description').body
                        },
                        "startDate":Moment.utc(this.model.get('startDate')).format('L'),
                        "endDate":Moment.utc(this.model.get('endDate')).format('L'),
                        "updated_at": Moment.utc(this.model.get('updated_at')).format('L'),
                        "date_created" : Moment.utc(this.model.get('meta').date_created).format('L'),
                         "businessUnitNames": (this.model.get('businessUnit') != undefined ? this.model.get('businessUnit') : this.na),
                            "fixedPricing":(this.model.get('pricing').fixedPricing != undefined ? this.model.get('pricing').fixedPricing : this.na),
                            "estBasedFee":(this.model.get('pricing').estBasedFee != undefined ? this.model.get('pricing').estBasedFee : this.na),
                            "targetPricing":(this.model.get('pricing').targetPricing != undefined ? this.model.get('pricing').targetPricing : this.na),
                            "costPlusPricing":(this.model.get('pricing').costPlusPricing != undefined ? this.model.get('pricing').costPlusPricing : this.na),
                            "firmPricing":(this.model.get('pricing').firmPricing != undefined ? this.model.get('pricing').firmPricing : this.na),
                            "volDrivenPricing":(this.model.get('pricing').volDrivenPricing != undefined ? this.model.get('pricing').volDrivenPricing : this.na)

                    };
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
                    this.flash("animated fadeIn bg-success");
                },
                submitClicked: function(e){
                    e.preventDefault();
                    var data = Backbone.Syphon.serialize(this);
                    console.log('Submited data: '+JSON.stringify(data));
                    this.trigger("price:update",data);
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
                }
            });





            window.JSZip = jszip;


            View.ContractExport = Marionette.ItemView.extend({
                template:exportView,
                events:{
                    "click button.js-back":"backClicked"
                },
                backClicked:function(e){
                    e.preventDefault();
                    this.trigger('back:clicked');
                },
               onRender:function(){
                   var exportData = new kendo.Backbone.DataSource({
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
                           fileName: "URS SetList.xlsx",
                           //proxyURL: "http://demos.telerik.com/kendo-ui/service/export",
                           //proxyURL: "http://localhost:8000",
                           filterable: true
                       },
                       dataSource: exportData,
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
