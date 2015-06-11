define(["app",
        "tpl!apps/header/list/templates/list.html",
        "tpl!apps/header/list/templates/list_item.tpl"],
        function(AppManager, listTpl, listItemTpl){
  AppManager.module("HeaderApp.List.View", function(View, AppManager, Backbone, Marionette, $, _,Bootstrap){
    View.Header = Marionette.ItemView.extend({
      template: listItemTpl,
      tagName: "li",

      events: {
          "click a": "navigate",
          "click .Login":"loginBtn",
          "click .Logout":"logoutBtn"

      },
      ui: {
          login: "a.Login",
          logout:"a.Logout"
      },
      onRender: function(){
            if(this.model.selected){
                // add class so Bootstrap will highlight the active entry in the navbar
                this.$el.addClass("active");
            }
         /** var text = this.ui.login.text();
          console.log('login text: '+ text);
          if(text === 'Login'){
              this.ui.logout.parent().hide();
          }else{
              this.ui.logout.parent().show();
          }**/
          //this.ui.logout.hide();
      },
      navigate: function(e){
        e.preventDefault();
        this.trigger("navigate", this.model);
          //$('body').find('div.collapse').collapse('toggle');
      },
      loginBtn: function(e){
        e.preventDefault();
        //this.trigger("loginBtn",this);
      },
      logoutBtn: function(e){
        e.preventDefault();
       // this.trigger("logoutBtn",this);
         // this.ui.logout.hide();
      }
    });

    View.Headers = Marionette.CompositeView.extend({
      template: listTpl,
      tagName:'nav',
      className: "white navbar navbar-default navbar-fixed-top ",
      childView: View.Header,
      childViewContainer: 'div ul.ulNavBar',//ul.ulNavBar
        onRender:function(){
            this.$el.find('ul.auth').find('a.Login').text('Dashboard');
          var logout = this.$el.find('ul.auth').find('a.Logout');
          if(logout.hasClass('hidden')){
              logout.toggleClass('hidden');
          }
        },
      triggers:{
            "click a.Login":"homeBtn:clicked",
            "click a.Logout":"logoutBtn:logout",
          "click a.Admin":"admin:contacts"
        },
      events: {
        "click a.navbar-brand": "brandClicked",
          "click .backBtn": "backBtn",
          "click .js-change-language": "changeLanguage",
          "click button.navbar-toggle":"navbarToggle",
          "click  a":"removeMenu",
          "click li.homeBtn":"homeClicked",
          "change .js-change-language": "changeLanguage",
          "click a.Dashboard":"userDashboard",
          "click a.Settings":"userSettings"
         // "click a.logout": "logoutClick"
      },
    userSettings:function(e){
        e.preventDefault();
        var id = this.$(e.currentTarget).data('id');
        this.trigger('settingsBtn:settings',id);
    },
    userDashboard:function(e){
        e.preventDefault();
        var id = this.$(e.currentTarget).data('id');
        this.trigger('dashboardBtn:dashboard',id);
    },
    brandClicked: function(e){
        e.preventDefault();
        this.trigger("brand:clicked");
    },
    backBtn: function(e){
        e.preventDefault();
        this.trigger("backBtn:clicked");
    },
    changeLanguage: function(e){
        e.preventDefault();
        var lang = $(e.target).attr('id');
        this.trigger("language:change", lang);
    },
    homeClicked: function(e){
        e.preventDefault();
        this.trigger("homeBtn:clicked");
    },
    navbarToggle: function(e){
        e.preventDefault();
        //console.log(e.currentTarget);
        $('body').find('div.collapse').collapse('toggle');
    },
    removeMenu: function(e){
        e.preventDefault();
        var logout =this.$el.find('li.user');
        if(logout.hasClass('open')){
            logout.toggleClass('open');
        }
        //console.log(e.currentTarget);
       // $('body').find('div.collapse').collapse('toggle');
    }
    });
  });
    /**_.extend(List.Headers.prototype, {
        brandClicked: function(e){
            e.preventDefault();
            this.trigger("brand:clicked");
        },

        changeLanguage: function(e){
            e.preventDefault();
            var lang = $(e.target).val();
            this.trigger("language:change", lang);
        }
    });**/
  return AppManager.HeaderApp.List.View;
});











