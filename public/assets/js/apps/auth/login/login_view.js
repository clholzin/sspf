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
    "tpl!apps/auth/login/templates/view.tpl"],
    function(ContactManager,
    layoutTpl, panelTpl, noneTpl, listTpl, listItemTpl,
    CommonViews,loginForm,viewChange,viewTpl){
    ContactManager.module("AuthApp.Auth.View", function(View, ContactManager, Backbone, Marionette, $, _){

        View.Layout = Marionette.LayoutView.extend({
            template: layoutTpl,

            regions: {
                panelRegion: "#panel-region",
                userRegion: "#user-region"
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
            templateHelpers: function() {
                return {
                    title: 'Login'
                }
            },
            initialize: function(){
                //this.title = "Login";
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
                "click a.js-edit": "editClicked"
            },

            editClicked: function(e){
                e.preventDefault();
                this.trigger("auth:edit", this.model);
            }
        });

    });

    return ContactManager.AuthApp.Auth.View;
});
