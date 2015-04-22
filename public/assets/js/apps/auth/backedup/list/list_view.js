define(["app",
        "tpl!apps/auth/list/templates/layout.tpl",
        "tpl!apps/auth/list/templates/panel.tpl",
        "tpl!apps/auth/list/templates/none.tpl",
        "tpl!apps/auth/list/templates/list.tpl",
        "tpl!apps/auth/list/templates/list_item.tpl"],
       function(ContactManager, layoutTpl, panelTpl, noneTpl, listTpl, listItemTpl){
  ContactManager.module("AuthApp.List.View", function(View, ContactManager, Backbone, Marionette, $, _){
    View.Layout = Marionette.LayoutView.extend({
      template: layoutTpl,

      regions: {
        panelRegion: "#panel-region",
        contactsRegion: "#contacts-region"
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

    View.Login = Marionette.ItemView.extend({
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

    var NoAuthView = Marionette.ItemView.extend({
      template: noneTpl,
      tagName: "tr",
      className: "alert"
    });

    View.Logins = Marionette.CompositeView.extend({
      tagName: "table",
      className: "table table-hover",
      template: listTpl,
      emptyView: NoAuthView,
      childView: View.Login,
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
  });

  return ContactManager.AuthApp.List.View;
});
