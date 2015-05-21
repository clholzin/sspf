define(["app", "tpl!apps/contracts/common/templates/form.html", "backbone.syphon"],
       function(AppManager, formTpl){
  AppManager.module("ContractsApp.Common.Views", function(Views, AppManager, Backbone, Marionette, $, _){
    Views.Form = Marionette.ItemView.extend({
      template: formTpl,

      events: {
        "click button.js-submit": "submitClicked"
      },
        onShow:function(){
         //   this.$el.parent().addClass('fadeInLeft');
        },
        onBeforeDestroy:function(){
         //   this.$el.parent().removeClass('fadeInLeft');
        },
      submitClicked: function(e){
        e.preventDefault();
        var data = Backbone.Syphon.serialize(this);
          console.log('Submited role data: '+JSON.stringify(data));
        this.trigger("form:submit",data);
      },

      onFormDataInvalid: function(errors){
        var $view = this.$el;

        var clearFormErrors = function(){
          var $form = $view.find("form");
          $form.find(".help-inline.error").each(function(){
            $(this).remove();
          });
          $form.find(".control-group.error").each(function(){
            $(this).removeClass("error");
          });
        };

        var markErrors = function(value, key){
          var $controlGroup = $view.find("#contract-" + key).parent();
          var $errorEl = $("<span>", { class: "help-inline error", text: value });
          $controlGroup.append($errorEl).addClass("error");
        };

        clearFormErrors();
        _.each(errors, markErrors);
      }
    });
  });

  return AppManager.ContractsApp.Common.Views;
});
