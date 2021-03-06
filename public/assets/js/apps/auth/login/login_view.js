/**
 * Created by craig on 4/15/2015.
 */
define(["app",
    "tpl!apps/auth/login/templates/layout.tpl",
    "tpl!apps/auth/login/templates/panel.tpl",
    "tpl!apps/auth/login/templates/none.tpl",
    "tpl!apps/auth/login/templates/list.tpl",
    "tpl!apps/auth/login/templates/list_item.tpl",
    "apps/auth/common/views",
    "tpl!apps/auth/login/templates/login.html",
    "tpl!apps/auth/login/templates/change.html",
    "tpl!apps/auth/login/templates/view.html"],
    function(AppManager,
    layoutTpl, panelTpl, noneTpl, listTpl, listItemTpl,
    CommonViews,loginForm,viewChange,viewTpl){
    AppManager.module("AuthApp.Auth.View", function(View, AppManager, Backbone, Marionette, $, _){

        View.Layout = Marionette.LayoutView.extend({
            template: layoutTpl,

            regions: {
                panelRegion: "#panel-region",
                userRegion: "#user-region"
            },
            onRender:function(){
                this.$('#main-region').toggleClass('container container-fluid');
                    //.removeClass('container').addClass('container-fluid');
            },
            onBeforeDestroy:function(){
                this.$('#main-region').toggleClass('container container-fluid');
            }
        });

        View.Panel = Marionette.ItemView.extend({
            template: panelTpl,

            triggers: {
                "click button.js-new": "auth:new"
            },

            events: {
                "submit #filter-form": "filterUsers"
            },

            ui: {
                criterion: "input.js-filter-criterion"
            },

            filterUsers: function(e){
                e.preventDefault();
                var criterion = this.$(".js-filter-criterion").val();
                this.trigger("auth:filter", criterion);
            },

            onSetFilterCriterion: function(criterion){
                this.ui.criterion.val(criterion);
            }
        });

        View.List = Marionette.ItemView.extend({
            tagName: "tr",
            template: listItemTpl,
            triggers: {
                "click td a.js-show": "auth:show",
                "click td a.js-edit": "auth:edit",
                "click button.js-delete": "auth:delete"
            },
            events: {
                "click": "highlightName"
            },
            flash: function(cssClass){
                var $view = this.$el;
                $view.hide().toggleClass(cssClass).fadeIn(800, function(){
                    setTimeout(function(){
                        $view.toggleClass(cssClass)
                    }, 500);
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

        View.NoAuthView = Marionette.ItemView.extend({
            template: noneTpl,
            tagName: "div",
            className: "alert"
        });

        View.Lists = Marionette.CompositeView.extend({
            tagName: "table",
            className: "table table-hover",
            template: listTpl,
            emptyView: View.NoAuthView,
            childView: View.List,
            childViewContainer: "tbody",

            initialize: function(){
                this.listenTo(this.collection, "reset", function(){
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

        View.TryAgain = CommonViews.Form.extend({
            template: loginForm,
            initialize: function(){
                this.title = "Try again.";
            },
            onRender: function(){
                if(this.options.generateTitle){
                    var $title = $("<h1>", { text: this.title });
                    this.$el.prepend($title);
                }

                this.$(".js-submit").text("Login");
            }
        });

        View.LoginForm = CommonViews.Form.extend({
            template:loginForm,
            className:'animated fadeInUp',
            templateHelpers: function() {
                return {
                    title: 'Login'
                }
            },
            initialize: function(){
                //this.title = "Login";
                $(document).find('.backBtn').addClass('hidden');
            },
            onRender: function(){
                if(this.options.generateTitle){
                    var $title = $("<h1>", { text: this.title });
                    this.$el.prepend($title);
                }

                this.$(".js-submit").text("Login");
            }
        });

        View.Register = CommonViews.Form.extend({
            templateHelpers: function() {
                return {
                    title: 'Register'
                }
            },

            onRender: function(){
                this.$(".js-submit").text("Register");
            }
        });

        View.Edit = CommonViews.Form.extend({
            template: viewChange,
            templateHelpers: function() {
                return {
                    title: 'Change Password'
                }
            },
            initialize: function(){
                this.templateHelpers.title += this.model.get("userName");
            },
            onRender: function(){
               /** if(this.options.generateTitle){
                    var $title = $("<h1>", { text: this.title });
                    this.$el.prepend($title);
                }**/
                this.$(".js-change").text("Update");
            }
        });

        View.Show = Marionette.ItemView.extend({
            template: viewTpl,

            events: {
                "click a.js-edit": "editClicked",
                "click button.js-dashboard": "showDashboard"
            },
            onRender:function(){
                var body = $('body');
                body.animate({ scrollTop: 0 }, "fast");
               $(document).find('#main-region').removeClass('container').addClass('container-fluid');
                //.removeClass('container').addClass('container-fluid');
            },
            onBeforeDestroy:function(){
                $(document).find('#main-region').removeClass('container-fluid').addClass('container');
            },
            showDashboard: function(e){
                e.preventDefault();
                var name = this.$(e.currentTarget).data('id');
                this.trigger("auth:dashboard", name);
            },
            editClicked: function(e){
                e.preventDefault();
                this.trigger("auth:edit", this.model);
            }
        });

    });

    return AppManager.AuthApp.Auth.View;
});
