define(["marionette", "tpl!apps/about/show/templates/message.tpl"], function(Marionette, messageTpl){
  return {
    Message: Marionette.ItemView.extend({
      template: messageTpl,

        onShow:function(){
         this.$el.parent().addClass('fadeIn');
    },
    onBeforeDestroy:function(){
         this.$el.parent().removeClass('fadeIn').addClass('fadeIn');
    }
    })
  };
});
