define(["app", "tpl!apps/reports/common/templates/form.html",
        "tpl!apps/reports/common/templates/register.html",
        "backbone.syphon"],
       function(AppManager, formTpl, loginTpl){
  AppManager.module("ReportsApp.Common.Views", function(Views, AppManager, Backbone, Marionette, $, _){
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
          $form.find(".help-inline.has-error").each(function(){
            $(this).remove();
          });
          $form.find(".form-control.error").each(function(){
            $(this).removeClass("has-error");
          });
        };

        var markErrors = function(value, key){
          var $controlGroup = $view.find("#" + key).parent();
          var $errorEl = $("<span>", { class: "help-inline error", text: value });
          $controlGroup.append($errorEl).addClass("has-error");
        };

        clearFormErrors();
        _.each(errors, markErrors);
      }
    });

    Views.CreateUser =  Views.Form.extend({
       template:loginTpl,
        events: {
            "click button.js-register": "submitClicked"
        }

    });



  });

  return AppManager.ReportsApp.Common.Views;
});
