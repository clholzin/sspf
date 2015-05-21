define(["app", "apps/contracts/common/views",
    "tpl!apps/contracts/edit/templates/list.html",
    "tpl!apps/contracts/edit/templates/list_item.html",
    "tpl!apps/contracts/edit/templates/missing.html",
    "tpl!apps/contracts/edit/templates/layout.html",

    "tpl!apps/contracts/edit/templates/category/reportingdates.html",
    "tpl!apps/contracts/edit/templates/category/pricing.html",
    "tpl!apps/contracts/edit/templates/category/deliverables.html",

    "vendor/moment"], function(AppManager,
                   CommonViews, listTpl, listItemTpl,missingTpl,layoutTpl,
                   reportsTpl,pricingTpl,deliverablesTpl,
           Moment){
    AppManager.module("ContractsApp.Edit.View", function(View, AppManager, Backbone, Marionette, $, _){

        View.Regions = Marionette.LayoutView.extend({
            template: layoutTpl,
            regions: {
                panelRegion: "#top-panel",
                mainRegion: "#edit-panel",
                rightRegion: "#right-panel"
            },
            onShow:function(){
           var parent = this.$el.parent();
              //  parent.removeClass('fadeIn').addClass('fadeIn');
                parent.removeClass('container').addClass('fluid-container');
            },
            onBeforeDestroy :function(){
                var parent = this.$el.parent();
               // parent.addClass('fadeIn').removeClass('fadeIn');
                parent.removeClass('fluid-container').addClass('container');
            },
            onRender:function(){
            }
        });

        View.MissingContract = Marionette.ItemView.extend({
            template: missingTpl
        });


        View.PanelItem = Marionette.ItemView.extend({
            template: listItemTpl,
            tagName: "li",
            events: {
                "click a": "navigate"
            },
            ui: {

            },
            onRender: function(){
                if(this.model.selected){
                    // add class so Bootstrap will highlight the active entry in the navbar
                    this.$el.addClass("active");
                }
            },
            navigate: function(e){
                e.preventDefault();
                this.trigger("navigate", this.model);
                //$('body').find('div.collapse').collapse('toggle');
            }
        });

        View.PanelItems = Marionette.CompositeView.extend({
            template: listTpl,
            className: "black navbar navbar-default navbar-fixed-top",
            childView: View.PanelItem,
            childViewContainer: 'div ul.ulNavBar',//ul.ulNavBar

            events: {
                "click button.navbar-toggle":"navbarToggle",
                "click  a":"removeMenu"
            },

            navbarToggle: function(e){
                e.preventDefault();
                //console.log(e.currentTarget);
                this.$el.find('div.collapse').collapse('toggle');
            }
        });


        View.Edit = CommonViews.ContractEdit.extend({
            //title : 'Edit:',
        initialize: function(){
            this.title = "Edit:";
            this.$el.toggleClass('animated fadeIn');
        },
        onBeforeDestroy:function(){
            this.$el.toggleClass('animated fadeIn').toggleClass('animated fadeOutDown');
        },
        templateHelpers:function(){
            var eDate = this.model.get('endDate'),
                sDate = this.model.get('startDate'),
            //updated_at = this.model.get('updated_at'),
                test = Moment.utc(eDate).format('YYYY-MM-DD'),
                endD = Moment.utc(eDate).format('YYYY-MM-DD'),
                startD = Moment.utc(sDate).format('YYYY-MM-DD');
            console.log(test);
            return {
                contract:this.model.get('contract'),
                endDate: endD,
                startDate: startD,
                updated_at: Moment().format('YYYY-MM-DD, h:mm:ss a')
            }
        },
        onRender: function(){
            if(this.options.generateTitle){
                var $title = $("<h3>", { text: this.title });
                this.$el.prepend($title);
            }

            this.$(".js-submit").text("Update");
        },
        flash: function(cssClass){
            var $view = this.$list;
            $view.hide().toggleClass(cssClass).fadeIn(function(){
                setTimeout(function(){
                    $view.toggleClass(cssClass)
                }, 2000);
            });
        }
    });

        View.ReportingDates = View.Edit.extend({
            template:reportsTpl,
            initialize: function(){
                this.title = "ReportingDates:";
                this.$el.toggleClass('animated fadeIn');
            },
            events:{
                'click #mytab a':'changeTab'
            },
            onBeforeDestroy:function(){
                this.$el.toggleClass('animated fadeIn').toggleClass('animated fadeOutDown');
            },
            changeTab:function(){
                 this.$el.tab('show');

            }

        });


        View.Pricing = View.Edit.extend({
            template:pricingTpl,
            events: {
                "click button.js-edit": "Edit",
                'dblclick ul.js-dbclick': 'Edit',
                'click button.js-cancel': 'Cancel',
                'click button.js-submit': 'submitPricing',
                'click button.js-obligations': 'submitObligations'
            },
            initialize: function(){
                this.title = "Pricing:";
                this.$el.toggleClass('animated fadeIn');
            },
            onRender:function(){
                if(this.options.generateTitle){
                    var $title = $("<h3>", { text: this.title });
                    this.$el.prepend($title);
                }
                this.$list = this.$('.js-dbclick');
                this.$pricingform = this.$('form#pricing');
                this.$objlForm =  this.$('form#obligation');
                this.$el.pricingform = this.$pricingform;
                this.$el.objlForm = this.$objlForm;
            },
            onBeforeDestroy:function(){
                this.$el.removeClass('animated fadeIn').toggleClass('animated fadeOutDown');
            },
            templateHelpers:function(){
                var pricing = this.model.get('pricing');
                var obligations = this.model.get('obligations');
                console.log(JSON.stringify(pricing));
                return {
                    "fixedPricing":pricing.fixedPricing,
                        "estBasedFee":pricing.estBasedFee,
                        "targetPricing":pricing.targetPricing,
                        "costPlusPricing":pricing.costPlusPricing,
                        "firmPricing":pricing.firmPricing,
                        "volDrivenPricing":pricing.volDrivenPricing,
                    "obligations": {
                        "version": obligations.version,
                        "changeDate":  Moment.utc(obligations.changeDate).format("L"),
                        "allowable": obligations.allowable,
                        "comment": obligations.comment
                    }
                };
            },
            Edit: function (e) {
                e.preventDefault();
                this.render();
               // this.$editBtn.text('Cancel').removeClass('js-edit').addClass('js-cancel');
                this.$list.parent().toggleClass('hidden');
                this.$pricingform.toggleClass('hidden');
                // this.$el.addClass('editing');
                this.$pricingform.find('input#fixedPricing').focus();
                this.flash("animated fadeIn bg-success");
            },
            Cancel: function () {
               // this.$cancelBtn.text('Edit').addClass('js-edit').removeClass('js-cancel');
                this.$list.parent().toggleClass('hidden');
                this.$pricingform.toggleClass('hidden');
            },
            submitPricing: function(e){
                e.preventDefault();
                console.log(this);
                var data = Backbone.Syphon.serialize($("form#pricing")[0]);
                console.log('Submited data: '+JSON.stringify(data));
                this.trigger("form:submit",data);
            },
            submitObligations: function(e){
                e.preventDefault();
                var data = Backbone.Syphon.serialize($("form#obligation")[0]);
                console.log('Submited data: '+JSON.stringify(data));
                this.trigger("form:submit",data);
            }

        });


        View.Deliverables = View.Edit.extend({
            template:deliverablesTpl,
            events: {
                "click button.js-edit": "Edit",
                'dblclick ul.js-dbclick': 'Edit',
                'click button.js-new':'New',
                'click button.js-cancelNew':'toggleNew',
                'click .js-delete': 'Remove',
                'click button.js-cancel': 'Cancel',
                'click button.js-submit': 'submitData',
                'click button.js-submitNew': 'newData'
            },
            initialize: function(){
                this.title = "Deliverables:";
                this.$el.toggleClass('animated fadeIn');
            },
            templateHelpers:function(){
                return{
                    deliverables:this.model.get('deliverables'),
                    data_created:Moment().format('YYYY/MM/DD')
                };
            },
            onRender:function(){
                if(this.options.generateTitle){
                    var $title = $("<h3>", { text: this.title });
                    this.$el.prepend($title);
                }
                        //this.$newform = this.$('form#deliverablesForm');
                        //this.$list = this.$('.js-dbclick');
            },
            onBeforeDestroy:function(){
                this.$el.removeClass('animated fadeIn').toggleClass('animated fadeOutDown');
            },
            New:function(e){
                this.$newForm = this.$('form#deliverablesNew');
                this.$newForm.toggleClass('hidden');
            },
            toggleNew:function(e){
                this.$cancelForm = this.$('form#deliverablesNew');
                this.$cancelForm.toggleClass('hidden');
            },
            Edit: function (e) {
                e.preventDefault();
               // this.render();
                this.$list = this.$(e.currentTarget).parent('ul.js-dbclick');
                this.$list.toggleClass('hidden');
                var id = this.$(e.currentTarget).data('id');
                this.$formId =  this.$('form#form-'+id);
                this.$formId.toggleClass('hidden');
                this.$formId.find('form input:first-child').focus();
                this.flash("animated fadeIn bg-success");
            },
            Cancel: function (e) {
                // this.$cancelBtn.text('Edit').addClass('js-edit').removeClass('js-cancel');
                this.$list = this.$(e.currentTarget).parent('ul.js-dbclick');
                this.$list.toggleClass('hidden');
                var id = this.$(e.currentTarget).data('id');
                this.$formId =  this.$('form#form-'+id);
                this.$formId.toggleClass('hidden');
            },
            submitData: function(e){
                e.preventDefault();
                var id = $(e.currentTarget).data('id');
                var data = Backbone.Syphon.serialize($('form#form-'+id)[0]);
                console.log('Submited data: '+JSON.stringify(data));
                this.trigger("form:submit",data,id);
            },
            newData: function(e){
                e.preventDefault();
                var id = $(e.currentTarget).data('id');
                var data = Backbone.Syphon.serialize($('form#deliverablesNew')[0]);
                console.log('new data: '+JSON.stringify(data));

                this.trigger("form:submit",data);
            },
            Remove: function(e) {
                e.preventDefault();
                var self = this;
                var id = $(e.currentTarget).data('id');
                this.render();
                console.log(id);
                if (id === null) {
                    id = undefined;
                }
                if (confirm('Are you sure you want to Delete') === false) {
                    return;
                }
                var objtoDelete = $.grep(self.model.get('deliverables'), function (item,index) {
                    console.log(index);
                    return index !== id;
                });
                console.log(JSON.stringify(objtoDelete));
                self.model.save({'deliverables': objtoDelete});
                AppManager.execute("alert:show", ({
                    type: "info",
                    message: "Removed comment"
                }));
                self.render();
            }
        });

        View.Metrics = View.Edit.extend({
            initialize: function(){
                this.title = "Metrics:";
                this.$el.toggleClass('animated fadeIn');
            },
            onBeforeDestroy:function(){
                this.$el.removeClass('animated fadeIn').toggleClass('animated fadeOutDown');
            }

        });

        View.RecoveryBases = View.Edit.extend({
            initialize: function(){
                this.title = "Recovery Bases:";
                this.$el.toggleClass('animated fadeIn');
            },
            onBeforeDestroy:function(){
                this.$el.removeClass('animated fadeIn').toggleClass('animated fadeOutDown');
            }

        });

        View.Payments = View.Edit.extend({
            initialize: function(){
                this.title = "Payments:";
                this.$el.toggleClass('animated fadeIn');
            },
            onBeforeDestroy:function(){
                this.$el.removeClass('animated fadeIn').toggleClass('animated fadeOutDown');
            }

        });

        View.Milestones = View.Edit.extend({
            initialize: function(){
                this.title = "Milestones:";
                this.$el.toggleClass('animated fadeIn');
            },
            onBeforeDestroy:function(){
                this.$el.removeClass('animated fadeIn').toggleClass('animated fadeOutDown');
            }

        });

        View.SubContractors = View.Edit.extend({
            initialize: function(){
                this.title = "SubContractors:";
                this.$el.toggleClass('animated fadeIn');
            },
            onBeforeDestroy:function(){
                this.$el.removeClass('animated fadeIn').toggleClass('animated fadeOutDown');
            }

        });


    });

    return AppManager.ContractsApp.Edit.View;
});
