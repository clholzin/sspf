define(["marionette", "jquery-ui"], function(Marionette){
  Marionette.Region.Dialog = Marionette.Region.extend({
    onShow: function(view){
      this.listenTo(view, "dialog:close", this.closeDialog);

      var self = this;
      this.$el.dialog({
        modal: true,
        title: view.title,
        width: "auto",
        class:'animated fadeIn',
          show: {
              effect: "fadeIn",
              duration: 150
          },
          hide: {
              effect: "fadeIn",
              duration: 100
          },
        close: function(e, ui){
          self.closeDialog();
        }
      });
    },

    closeDialog: function(){
      this.stopListening();
      this.empty();
      this.$el.dialog("destroy");
    }
  });

  return Marionette.Region.Dialog;
});
