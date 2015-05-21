define(["../../../../app", "tpl!apps/contracts/common/templates/form_notify.html", "backbone.syphon"],
       function(AppManager, formTpl){
  AppManager.module("ContractsApp.Common.NotifyViews", function(Views, AppManager, Backbone, Marionette, $, _){
    Views.NotifyForm = Marionette.ItemView.extend({
      template: formTpl,
        triggers:{
            "click .btn-default":"dialog:close"
        },
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
          console.log('Submited data: '+JSON.stringify(data));
          this.trigger("form:submit",data);
      },

      onFormDataInvalid: function(errors){
        var $view = this.$el;

        var clearFormErrors = function(){
          var $form = $view.find("form");
          $form.find(".help-inline.error").each(function(){
            $(this).remove();
          });
          $form.find(".form-group.error").each(function(){
            $(this).removeClass("error");
          });
        };

        var markErrors = function(value, key){
         // var $controlGroup = $view.find("#notify-" + key).parent();
            console.log(key+' '+value);
            var $controlGroup = $view.find("input #"+key).parent();
          var $errorEl = $("<span>", { class: "help-inline error", text: value });
          $controlGroup.append($errorEl).addClass("error");
        };

        clearFormErrors();
        _.each(errors, markErrors);
      }
    });
  });

  return AppManager.ContractsApp.Common.NotifyViews;
});
