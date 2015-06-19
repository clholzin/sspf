define(["app", "apps/contracts/common/views",
    "tpl!apps/contracts/edit/templates/list.html",
    "tpl!apps/contracts/edit/templates/list_item.html",
    "tpl!apps/contracts/edit/templates/missing.html",
    "tpl!apps/contracts/edit/templates/layout.html",
    "tpl!common/templates/footer.html",
    "tpl!apps/contracts/edit/templates/category/reportingdates.html",
    "tpl!apps/contracts/edit/templates/category/pricing.html",
    "tpl!apps/contracts/edit/templates/category/deliverables.html",

    "vendor/moment","vendor/numeral"], function(AppManager,
                   CommonViews, listTpl, listItemTpl,missingTpl,layoutTpl,footerTpl,
                   reportsTpl,pricingTpl,deliverablesTpl,
                   Moment,Numeral){
    AppManager.module("ContractsApp.Edit.View", function(View, AppManager, Backbone, Marionette, $, _){

        View.Regions = Marionette.LayoutView.extend({
            template: layoutTpl,
            regions: {
                panelRegion: "#left-panel",
                mainRegion: "#edit-panel"
                //rightRegion: "#right-panel"
            },
            onShow:function(){
           var parent = this.$el.parent();
              //  parent.removeClass('fadeIn').addClass('fadeIn');
                parent.removeClass('container').addClass('fluid-container');
            },
            onBeforeDestroy :function(){
                var parent = this.$el.parent();
                parent.removeClass('fluid-container').addClass('container');
                var main = $(document).find('#main-region');
                main.removeClass('animated fadeInLeft fadeInRight');
                main.addClass('animated fadeInLeft');
            },
            onRender:function(){
            }
        });

        View.MissingContract = Marionette.ItemView.extend({
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
                var html = '<li class="bg-info"><a class="js-save"><i class="glyphicon glyphicon-save"></i> Save</a></li>';
                   html += '<li class="bg-success"><a  class="js-submit"><i class="glyphicon glyphicon-share-alt"></i> </a></li>';
                controlBtn.prepend(html);
                console.log('!!!!!!!!!!!!!!  hit footer render');
            },
            events: {
                "click a.js-save": "saveContract",
                "click a.js-submit": "submitReport"
            },
            saveContract: function (e) {
                e.preventDefault();
                this.trigger("footer:contract:save",this.model);
            },
            submitReport: function () {
                console.log('hit footer js-submitReport');
                AppManager.execute("alert:show",({type:"success",message:'Shared'}));
            }
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
                    // add class so Bootstrap will highlight the active entry in the navbar
            },
            navigate: function(e){
                e.preventDefault();
                var li = this.$(e.currentTarget).parent();
                var siblings  = this.$(e.currentTarget).parent().siblings();
                siblings.removeClass("active");
                li.addClass('active');
                this.trigger("navigate", this.model);
                //$('body').find('div.collapse').collapse('toggle');
            }
        });

        View.PanelItems = Marionette.CompositeView.extend({
            template: listTpl,
            tagName:"ul",
            className: "nav nav-sidebar animated slideInLeft",
            childView: View.PanelItem,
            //childViewContainer: 'div ul.ulEditBar',//ul.ulNavBar
            onRender:function(){
                this.$el.find('li:first').addClass("active");
            },
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
            this.title = "General Info:";
            this.$el.toggleClass('animated fadeIn');
        },
        onBeforeDestroy:function(){
            this.$el.toggleClass('animated fadeIn').toggleClass('animated fadeOutDown');
        },
        templateHelpers:function(){
            var eDate = this.model.get('endDate'),
                sDate = this.model.get('startDate'),
            //updated_at = this.model.get('updated_at'),
                test = Moment.utc().format('MM/DD/YYYY'),
                endD = Moment.utc(eDate).format('YYYY-MM-DD'),
                startD = Moment.utc(sDate).format('YYYY-MM-DD');
            console.log(test);
            var contract = this.model.get('contract');
            return {
                value: numeral(contract.amount).format('0.00'),
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
                this.$pricingform = this.$el.find('form#pricing');
                this.$objlForm =  this.$el.find('form#obligation');
               // this.$el.pricingform = this.$pricingform;
               // this.$el.objlForm = this.$objlForm;
            },
            onBeforeDestroy:function(){
                this.$el.removeClass('animated fadeIn').toggleClass('animated fadeOutDown');
            },
            templateHelpers:function(){
                var pricing = this.model.get('pricing');
                var obligations = this.model.get('obligations');
                console.log(JSON.stringify(pricing));
                return {
                    "fixedPricing":Numeral(pricing.fixedPricing).format('$0,0.00'),
                    "estBasedFee":Numeral(pricing.estBasedFee).format('$0,0.00'),
                    "targetPricing":Numeral(pricing.targetPricing).format('$0,0.00'),
                    "costPlusPricing":Numeral(pricing.costPlusPricing).format('$0,0.00'),
                    "firmPricing":Numeral(pricing.firmPricing).format('$0,0.00'),
                    "volDrivenPricing":Numeral(pricing.volDrivenPricing).format('$0,0.00'),

                    "fixedPricing_edit":Numeral(pricing.fixedPricing).format('0.00'),
                    "estBasedFee_edit":Numeral(pricing.estBasedFee).format('0.00'),
                    "targetPricing_edit":Numeral(pricing.targetPricing).format('0.00'),
                    "costPlusPricing_edit":Numeral(pricing.costPlusPricing).format('0.00'),
                    "firmPricing_edit":Numeral(pricing.firmPricing).format('0.00'),
                    "volDrivenPricing_edit":Numeral(pricing.volDrivenPricing).format('0.00'),

                    "obligations": {
                        "version": obligations.version,
                        "changeDate":  Moment.utc(obligations.changeDate).format("YYYY-MM-DD"),
                        "allowable_edit": Numeral(obligations.allowable).format('0.00'),
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
                this.flash("animated fadeIn");
            },
            Cancel: function () {
               // this.$cancelBtn.text('Edit').addClass('js-edit').removeClass('js-cancel');
                this.$list.parent().toggleClass('hidden');
                this.$pricingform.toggleClass('hidden');
                 this.flash("animated fadeIn");
            },
            submitPricing: function(e){
                e.preventDefault();
                var self = this;
                var data = Backbone.Syphon.serialize($("form#pricing")[0]);
                console.log('Submited data: '+JSON.stringify(data));
                this.trigger("form:submit",data);
                this.flash("animated fadeIn");
            },
            submitObligations: function(e){
                e.preventDefault();
                var data = Backbone.Syphon.serialize($("form#obligation")[0]);
                console.log('Submited data: '+JSON.stringify(data));
                this.trigger("form:submit",data);
                this.$objlForm.toggleClass('animated fadeIn');
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
