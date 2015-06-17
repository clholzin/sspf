requirejs.config({
  baseUrl: "assets/js",
  paths: {
    backbone: "vendor/backbone",
    "backbone.role":'vendor/role',
    "backbone.picky": "vendor/backbone.picky",
    "backbone.syphon": "vendor/backbone.syphon",
      "backbone.filtered": "vendor/backbone-filter-collection",
      "backbone.genetics": "vendor/backbone.genetics",
    "backbone.deep.model":"vendor/backbone.deep.model",
    jquery: "vendor/jquery",

      "kendo":"vendor/kendoUI/kendo.all.min",
      "calendar":"vendor/kendoUI/kendo.calendar.min",
      "kendo_core":"vendor/kendoUI/kendo.core.min",

    "jquery-ui": "vendor/jquery-ui",
    "jszip":"vendor/jszip",
    json2: "vendor/json2",
    localstorage: "vendor/backbone.localstorage",
    marionette: "vendor/backbone.marionette",
    spin: "vendor/spin",
    "spin.jquery": "vendor/spin.jquery",
    text: "vendor/text",
    tpl: "vendor/underscore-tpl",

    handlebars:'vendor/handlebars-v3.0.1',
    marionetteHandlebars:'vendor/marionette.handlebars',
    "hbs":"vendor/hbs",

    "i18nprecompile":"vendor/i18nprecompile",
    underscore: "vendor/underscore",
    bootstrap: "vendor/bootstrap.min.3.3.4",
    nprogress:"vendor/nprogress",
    numeral:"vendor/numeral",
    moment:"vendor/moment",
    "moment-fquarter":"vendor/moment-fquarter",
    "precise-range":"vendor/precise-range",
    "polyglot":"vendor/polyglot",
    "polyglotText":"apps/config/marionette/polyglot_configText",

      "kendo.backbone":'vendor/kendo.backbone'
  },

  shim: {
    "polyglotText": {
      deps: ["polyglot"],
      exports: "polyglotText"
    },
    "jszip": {
      exports: "jszip"
    },
    "numeral": {
      deps: ["jquery"],
      exports: "Numeral"
    },
    handlebars:{
      exports:"Handlebars"
    },
    underscore: {
      exports: "_"
    },
    nprogress: {
      deps: ["jquery"],
      exports: "NProgress"
    },
    moment: {
      exports: "Moment"
    },
    "moment-fquarter": {
      exports: "MomentFquarter"
    },
    "precise-range": {
      exports: "MomentRange"
    },
    bootstrap: {
      deps: ["jquery"],
      exports: "Bootstrap"
    },
    backbone: {
      deps: ["jquery", "underscore", "json2"],
      exports: "Backbone"
    },
    kendo: {
      deps: ["jquery"],
      exports: "kendo"
    },
    "kendo.backbone":["backbone"],
    "backbone.picky": ["backbone"],
    "backbone.deep.model": ["backbone"],
    "backbone.syphon": ["backbone"],
    "backbone.role": ["backbone"],
    "backbone.filtered":["backbone"],
    "backbone.genetics":["backbone"],
    localstorage: ["backbone"],
    marionette: {
      deps: ["backbone","bootstrap","backbone.role"],
      exports: "Marionette"
    },
    "jquery-ui": ["jquery"],
    "spin.jquery": ["spin", "jquery"],
     tpl: ["text"]
  },
    // hbs config - must duplicate in Gruntfile.js Require build
   hbs: {
        templateExtension: "html",
        helperDirectory: "common/templates/helpers/",
        i18nDirectory: "common/templates/i18n/",

        compileOptions: {}        // options object which is passed to Handlebars compiler
    }
});

require(["app","apps/header/header_app"], function(AppManager){
    AppManager.start({
      acceptedLanguages: ["en", "fr","rs"]
  });
});
