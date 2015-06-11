define(["marionette", "jquery-ui",'bootstrap'], function(Marionette){
  Marionette.Region.Model = Marionette.Region.extend({
    onShow: function(view){
      this.listenTo(view, "dialog:close", this.closeDialog);

      var self = this;
      this.$el.modal({
          show: true,
          keyboard:true,
        //title: view.title,
        //width: "auto",
        close: function(e, ui){
          self.closeDialog();
        }
      });
    },

    closeDialog: function(){
      this.stopListening();
      this.empty();
      this.$el.modal('hide');
    }
  });

  return Marionette.Region.Model;
});
