define(["app", "tpl!apps/contracts/common/templates/form.html",
        "tpl!apps/contracts/common/templates/form_notify.html",
        "tpl!apps/contracts/edit/templates/category/contractbegin.html",
        "backbone.syphon"],
       function(AppManager, formTpl,formNotifyTpl,formContractEdit){
  AppManager.module("ContractsApp.Common.Views", function(Views, AppManager, Backbone, Marionette, $, _){
    Views.Form = Marionette.ItemView.extend({
      template: formTpl,
      triggers:{
        "click .js-close":"dialog:close"
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
          $form.find(".form-group.has-error").each(function(){
            $(this).removeClass("has-error");
          });
        };

        var markErrors = function(value, key){
            console.log(key+' '+value);
         // var $controlGroup = $view.find("#contract-" + key).parent();
            var $item = $view.find('form').find("#"+key);
            var $controlGroup = $view.find('form').find("#"+key).parent();
          var $errorEl = $("<span>", { class: "help-inline error text-danger animated fadeInUp", text: value });
          $controlGroup.append($errorEl).addClass("has-error");
        };
      //  var $item = $view.find('form').find("#"+key);
        clearFormErrors();
        _.each(errors, markErrors);

      }
    });

      Views.NotifyForm = Views.Form.extend({
          template: formNotifyTpl,
          triggers:{
              "click .btn-default":"dialog:close"
          }
      });

      Views.ContractEdit = Views.Form.extend({
          template: formContractEdit
      });

  });

  return AppManager.ContractsApp.Common.Views;
});
