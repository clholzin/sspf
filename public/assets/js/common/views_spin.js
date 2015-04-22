define(["app", "tpl!common/templates/loading.tpl",
    "spin.jquery","nprogress"], function(ContactManager, loadingTpl,spin,NProgress){
  ContactManager.module("Common.Views", function(Views, ContactManager, Backbone, Marionette, $, _){
    Views.Loading = Marionette.ItemView.extend({
      template: loadingTpl,

      title: "Loading Data",
      message: "Please wait, data is loading.",

      serializeData: function(){
        return {
          title: Marionette.getOption(this, "title"),
          message: Marionette.getOption(this, "message")
        }
      },

      onShow: function(){
       // NProgress.configure({ parent: '#spinner' });
        var opts = {
          lines: 13, // The number of lines to draw
          length: 4, // The length of each line
          width: 3, // The line thickness
          radius: 5, // The radius of the inner circle
          corners: 1, // Corner roundness (0..1)
          rotate: 0, // The rotation offset
          direction: 1, // 1: clockwise, -1: counterclockwise
          color: "#3585ba", // #rgb or #rrggbb
          speed: 1, // Rounds per second
          trail: 55, // Afterglow percentage
          shadow: false, // Whether to render a shadow
          hwaccel: false, // Whether to use hardware acceleration
          className: "spinner", // The CSS class to assign to the spinner
          zIndex: 2e9, // The z-index (defaults to 2000000000)
          top: "30px", // Top position relative to parent in px
          left: "auto" // Left position relative to parent in px
        };
        //$("#spinner").spin(opts);
          NProgress.start();
      },
        onBeforeDestroy: function(){
            NProgress.done();
        }
    });
  });

  return ContactManager.Common.Views;
});
