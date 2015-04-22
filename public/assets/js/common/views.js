define(["app", "tpl!common/templates/loading.tpl",
    "spin.jquery","nprogress"], function(ContactManager, loadingTpl,spin,NProgress){
  ContactManager.module("Common.Views", function(Views, ContactManager, Backbone, Marionette, $, _){
    Views.Loading = Marionette.ItemView.extend({
      template: loadingTpl,

      title: "Loading Screen",
      message: "Please wait, data is loading.",
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
      },
      onBeforeDestroy: function(){
            NProgress.done();
          this.$el.parent().removeClass('fadeInUp').addClass('fadeIn');
        }
    });
  });

  return ContactManager.Common.Views;
});
