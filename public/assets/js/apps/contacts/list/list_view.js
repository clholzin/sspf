define(["app",
        "tpl!apps/contacts/list/templates/layout.html",
        "tpl!apps/contacts/list/templates/panel.html",
        "tpl!apps/contacts/list/templates/none.html",
        "tpl!apps/contacts/list/templates/list.html",
        "tpl!apps/contacts/list/templates/list_item.html"],
       function(AppManager, layoutTpl, panelTpl, noneTpl, listTpl, listItemTpl){
  AppManager.module("ContactsApp.List.View", function(View, AppManager, Backbone, Marionette, $, _){
    View.Layout = Marionette.LayoutView.extend({
      template: layoutTpl,

      regions: {
        headerPanel: "#header-panel",
        menuPanel: "#menu-panel",
        contactsPanel: "#contacts-panel"
      },
        onShow:function(){
            this.$el.parent().removeClass('container fadeIn').addClass('container-fluid fadeIn');
        },
        onBeforeDestroy:function(){
            this.$el.parent().removeClass('container-fluid fadeIn').addClass('container fadeIn');
        }
    });

    View.Panel = Marionette.ItemView.extend({
      template: panelTpl,

      triggers: {
        "click button.js-new": "contact:new"
      },

      events: {
        "submit #filter-form": "filterContacts"
      },

      ui: {
        criterion: "input.js-filter-criterion"
      },

      filterContacts: function(e){
        e.preventDefault();
        var criterion = this.$(".js-filter-criterion").val();
        this.trigger("contacts:filter", criterion);
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

     var NoContactsView = Marionette.ItemView.extend({
         template: noneTpl,
         tagName: "tr",
         className: "alert"
     });

    View.Contact = Marionette.ItemView.extend({
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
                "_id": this.model.get('_id'),
                username: this.model.get("username")
            }
        },
        serializeData: function(){
            var roles = this.model.attributes.roles[0];
           // console.log(this.model.get("roles"));
            if(roles === undefined){
              //  console.log('serializeData issue'+ JSON.stringify(roles));
                var role = this.model.get("roles");
                return {
                    admin: role.admin === true ? this.okay : this.not,
                    creator: (role.creator === true ? this.okay : this.not),
                    review: (role.review === true ? this.okay : this.not),
                    approve: (role.approve === true ? this.okay : this.not),
                    supervisor: (role.supervisor === true ? this.okay : this.not)
                }
            }else {
                return {
                        admin: roles.admin === true ? this.okay : this.not,
                        creator: (roles.creator === true ? this.okay : this.not),
                        review: (roles.review === true ? this.okay : this.not),
                        approve: (roles.approve === true ? this.okay : this.not),
                        supervisor: (roles.supervisor === true ? this.okay : this.not)
                }
            }
        },
       /** behaviors: {
            DestroyWarn: {
                message: "you are destroying all your data is now gone!"
            }
        },**/
      triggers: {
        "click td a.js-show": "contact:show",
        "click td a.js-edit": "contact:edit",
        "click button.js-delete": "contact:delete"
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
        this.$el.toggleClass("info");
      },

      remove: function(){
        var self = this;
        this.$el.fadeOut(function(){
          Marionette.ItemView.prototype.remove.call(self);
        });
      }
    });


    View.Contacts = Marionette.CompositeView.extend({
      tagName: "table",
      className: "table table-hover",
      template: listTpl,
      emptyView: NoContactsView,
      childView: View.Contact,
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

  return AppManager.ContactsApp.List.View;
});


