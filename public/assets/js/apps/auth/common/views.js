define(["app", "tpl!apps/auth/login/templates/login.html", "backbone.syphon"],
       function(ContactManager, formTpl){
  ContactManager.module("AuthApp.Common.Views", function(Views, ContactManager, Backbone, Marionette, $, _){
    Views.Form = Marionette.ItemView.extend({
      template: formTpl,

      events: {
        "click button.js-submit": "submitClicked",
          "click button.js-register":"registerClicked",
          "click button.js-change":"changeClicked"
      },
        onShow:function(){
           // this.$el.parent().addClass('bounceIn');
        },
        onBeforeDestroy:function(){
           // this.$el.parent().removeClass('bounceIn');
        },
      registerClicked: function(e){
        e.preventDefault();
        var data = Backbone.Syphon.serialize(this);
          //console.log(data);
        this.trigger("form:register",data);
      },
      changeClicked: function(e){
        e.preventDefault();
        var data = Backbone.Syphon.serialize(this);
        //console.log(data);
        this.trigger("form:change",data);
      },
      submitClicked: function(e){
        e.preventDefault();
        var data = Backbone.Syphon.serialize(this);
          //console.log(data);
        this.trigger("form:submit", data);
      },

      onFormDataInvalid: function(errors){
        var $view = this.$el;

        var clearFormErrors = function(){
          var $form = $view.find("form");
          $form.find(".help-inline.error").each(function(){
            $(this).remove();
          });
          $form.find(".form-signin.error").each(function(){
            $(this).removeClass("error");
          });
        }

        var markErrors = function(value, key){
          var $controlGroup = $view.find("#auth-" + key).parent();
          var $errorEl = $("<span>", { class: "help-inline error", text: value });
          $controlGroup.append($errorEl).addClass("error");
        }

        clearFormErrors();
        _.each(errors, markErrors);
      },
      flash: function(cssClass){
            var $view = this.$el;
            $view.hide().toggleClass(cssClass).fadeIn(800, function(){
                setTimeout(function(){
                    $view.toggleClass(cssClass)
                }, 500);
            });
        }
    });
  });

  return ContactManager.AuthApp.Common.Views;
});
