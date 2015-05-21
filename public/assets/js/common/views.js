define(["app", "tpl!common/templates/loading.tpl",
    "spin.jquery","nprogress",'vendor/polyglot'], function(AppManager, loadingTpl,spin,NProgress){
  AppManager.module("Common.Views", function(Views, AppManager, Backbone, Marionette, $, _){
    Views.Loading = Marionette.ItemView.extend({
      template: loadingTpl,
      title: t("loading.title"),
      message: t("loading.message"),
      initialize:function(){
      },
      serializeData: function(){
        return {
          title: Marionette.getOption(this, "title"),
          message: Marionette.getOption(this, "message")
        }
      },
      onShow: function(){
       // NProgress.configure({ parent: '#spinner' });
          this.$el.parent().removeClass('fadeIn').addClass('fadeInUp');
          NProgress.start();
          NProgress.set(0.4);
      },
      onBeforeDestroy: function(){
            NProgress.done();
            this.$el.parent().removeClass('fadeInUp').addClass('fadeIn');
        }
    });
      _.extend(Marionette.View.prototype, {
          templateHelpers: {
              i18nUrl: function (url) {
                  return AppManager.i18n.currentLanguage + "/" + url;
              }
          }
      });
    Views.PaginationControls = Marionette.ItemView.extend({
        template: "#pagination-controls",
        className: "pagination",

        initialize: function(options){
            this.paginatedCollection = options.paginatedCollection;
            this.urlBase = options.urlBase;
            this.listenTo(this.paginatedCollection, "page:change:after", this.render);
        },

        events: {
            "click a[class=navigatable]": "navigateToPage"
        }
    });

    _.extend(Views.PaginationControls.prototype, {
        navigateToPage: function(e){
            e.preventDefault();
            var page = parseInt($(e.target).data("page"), 10);
            this.paginatedCollection.parameters.set("page", page);
            this.trigger("page:change", page);
        },

        serializeData: function(){
            var data = this.paginatedCollection.info(),
                url = this.urlBase,
                criterion = this.paginatedCollection.parameters.get("criterion");
            if(url){
                if(criterion){
                    url += "criterion:" + criterion + "+";
                }
                url += "page:";
            }
            data.urlBase = url;

            return data;
        }
    });

    Views.PaginatedView = Marionette.LayoutView.extend({
        template: "#paginated-view",

        regions: {
            paginationControlsRegion: ".js-pagination-controls",
            paginationMainRegion: ".js-pagination-main"
        },

        initialize: function(options){
            this.collection = options.collection;
            var eventsToPropagate = options.propagatedEvents || [];

            var controls = new Views.PaginationControls({
                paginatedCollection: this.collection,
                urlBase: options.paginatedUrlBase
            });
            var listView = new options.mainView({
                collection: this.collection
            });

            var self = this;
            this.listenTo(controls, "page:change", function(page){
                self.trigger("page:change", page);
            });
            _.each(eventsToPropagate, function(evt){
                self.listenTo(listView, evt, function(view, model){
                    self.trigger(evt, view, model);
                });
            });

            this.on("show", function(){
                this.paginationControlsRegion.show(controls);
                this.paginationMainRegion.show(listView);
            });
        }
    });

  });
  return AppManager.Common.Views;
});
