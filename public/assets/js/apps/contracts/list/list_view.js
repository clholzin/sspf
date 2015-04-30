define(["app",
        "tpl!apps/contracts/list/templates/layout.tpl",
        "tpl!apps/contracts/list/templates/panel.tpl",
        "tpl!apps/contracts/list/templates/none.tpl",
        "tpl!apps/contracts/list/templates/list.tpl",
        "tpl!apps/contracts/list/templates/list_item.html"],
       function(AppManager, layoutTpl, panelTpl, noneTpl, listTpl, listItemTpl){
  AppManager.module("ContractsApp.List.View", function(View, AppManager, Backbone, Marionette, $, _){
    View.Layout = Marionette.LayoutView.extend({
      template: layoutTpl,
      regions: {
        panelRegion: "#panel-region",
        contactsRegion: "#contracts-region"
      },
        onShow:function(){
            this.$el.parent().removeClass('fadeIn').addClass('fadeIn');
        },
        onBeforeDestroy :function(){
            this.$el.parent().addClass('fadeIn').removeClass('fadeIn');
        }
    });

    View.Panel = Marionette.ItemView.extend({
      template: panelTpl,

      triggers: {
        "click button.js-new": "contract:new"
      },

      events: {
        "submit #filter-form": "filterContracts"
      },

      ui: {
        criterion: "input.js-filter-criterion"
      },

      filterContracts: function(e){
        e.preventDefault();
        var criterion = this.$(".js-filter-criterion").val();
        this.trigger("contracts:filter", criterion);
      },

      onSetFilterCriterion: function(criterion){
        this.ui.criterion.val(criterion);
      }
    });

     /** var DestroyWarn = Marionette.Behavior.extend({
          // You can set default options
          // just like you can in your Backbone Models.
          // They will be overridden if you pass in an option with the same key.
          defaults: {
              "message": "You are destroying!"
          },

          // Behaviors have events that are bound to the views DOM.
          events: {
              "click @ui.destroy": "warnBeforeDestroy"
          },

          warnBeforeDestroy: function() {
              alert(this.options.message);
              // Every Behavior has a hook into the
              // view that it is attached to.
              this.view.destroy();
          }
      });**/


    View.Contract = Marionette.ItemView.extend({
      tagName: "tr",
      template: listItemTpl,
       okay:"text-success glyphicon glyphicon-ok",
       not :"text-danger glyphicon glyphicon-remove",
        initialize:function(attributes, options){
           // console.log(JSON.stringify(attributes.model.attributes));
            this.options = options;
            //console.log(this.model.attributes);

        },
        templateHelpers:function(){
            return {
                "_id": this.model.get('_id')
                //username: this.model.get("username")
            }
        },

       /** behaviors: {
            DestroyWarn: {
                message: "you are destroying all your data is now gone!"
            }
        },**/
      triggers: {
        "click td a.js-show": "contract:show",
        "click td a.js-edit": "contract:edit",
        "click button.js-delete": "contract:delete"
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

    var NoContractsView = Marionette.ItemView.extend({
      template: noneTpl,
      tagName: "tr",
      className: "alert"
    });

    View.Contracts = Marionette.CompositeView.extend({
      tagName: "table",
      className: "table table-hover",
      template: listTpl,
      emptyView: NoContractsView,
      childView: View.Contract,
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

  return AppManager.ContractsApp.List.View;
});


