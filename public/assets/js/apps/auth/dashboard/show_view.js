define(["app",
        "tpl!apps/auth/dashboard/templates/layout.html",
        "tpl!apps/auth/dashboard/templates/top.html",
        "tpl!apps/auth/dashboard/templates/main.html",
        "tpl!apps/auth/dashboard/templates/notify.html",
        "tpl!apps/auth/dashboard/templates/reports.html",
        "tpl!apps/auth/dashboard/templates/contract.html",
        "tpl!apps/auth/dashboard/templates/missing.html",
        "apps/auth/common/views",
        "vendor/moment","jszip",
        "vendor/kendoUI/kendo.all.min",
        //"vendor/kendoUI/kendo.core.min",
        //"vendor/kendoUI/kendo.calendar.min",
        "vendor/numeral","backbone.syphon"
            ],
    function(AppManager,layoutTpl,top,main,notify,reports,contract,missingTpl,
             CommonViews,Moment,jszip){
        AppManager.module("DashboardApp.Show.View", function(View, AppManager, Backbone, Marionette, $, _){

            window.JSZip = jszip;

            View.Regions = Marionette.LayoutView.extend({
                template: layoutTpl,
                regions: {
                    TopPanel: "#topDashboard-panel",
                    MainPanel: "#main-panel",
                    NotifyPanel: "#notify-panel",
                    ContractPanel: "#contract-panel"
                },
                onShow:function(){
                    var parent = this.$el.parent().parent();
                    parent.css('background-image','url(./assets/img/Picture1.jpg)');
                    parent.css('background-size','cover');
                    parent.css('background-repeat','no-repeat');
                    parent.css('background-attachment','fixed');
                },
                onBeforeDestroy :function(){
                    var parent = this.$el.parent().parent();
                    parent.removeAttr('style');
                },
                onRender:function(){

                }
            });

            View.Missing = Marionette.ItemView.extend({
                template: missingTpl
            });


            View.Top = Marionette.ItemView.extend({
                template: top,
                triggers: {
                    //"click button.js-new": "notify:new"
                },
                events:{
                    //"click li.report": "runFilter"
                }

            });



            View.NotifyView = Marionette.ItemView.extend({
                tagName:'tr',
                className:'bkg-white',
                template: notify,
                events: {
                   // "mouseout button.js-popover": "iniPopover",
                      "click button.js-popover": "showPopover",
                    "hover a#infotoshow": "info"
                },
                initialize:function(){},
                onRender:function(){
                    this.trigger("action:popover",this);
                },
               /** templateHelpers:function(){
                  //  console.log(JSON.stringify(this.collection.models));
                    var total = this.collection.length;
                    return {
                        titleReports:total > 1 ? total + ' Reports' : total + ' Report',
                        notifications:this.collection.models
                    }
                },**/
                iniPopover:function(){
                    this.$pop.popover();
                    //  this.iniPopover(e);
                },
                showPopover:function(e){
                    e.preventDefault();
                   this.trigger('action:popover',this);

                },
                info:function(e){
                    e.preventDefault();
                    this.$('#infotoshow').tooltip();
                },
                flash: function(cssClass){
                    var $view = this.$el;
                    $view.hide().toggleClass(cssClass).fadeIn(function(){
                        setTimeout(function(){
                            $view.toggleClass(cssClass)
                        }, 2000);
                    });
                }

            });
            View.LeftMenu = Marionette.CompositeView.extend({
                tagName: "table",
                className: "table table-condensed",
                template:reports,
                emptyView: View.Missing,
                childView:  View.NotifyView,
                emptyViewContainer: "ul",
                childViewContainer: "tbody",
                events:{
                   // 'click option':'filterByReport'
                },
               templateHelpers:function(){
                    //  console.log(JSON.stringify(this.collection.models));
                    var total = this.collection.length;
                    return {
                        titleReports:total > 1 ? total + ' Reports' : total + ' Report'
                    }
                },
                initialize: function(){
                    this.listenTo(this.collection, "reset", function(){
                        this.attachHtml = function(collectionView, childView, index){
                            collectionView.$el.append(childView.el);
                        };
                    });
                },
                onRenderCollection: function(){
                    this.attachHtml = function(collectionView, childView, index){
                        collectionView.$el.append(childView.el);
                    };
                },
                onRender:function(options){
                    // console.log(options);
                    //$('.nav-sidebar ul.animated').toggleClass('fadeInLeft fadeInRight');
                    this.$previous = options.previousModels;
                    var self = this;
                    $(document).ready(function(){
                        self.$el.popover();
                        self.$el.tooltip();
                    });
                    //_.sortBy(self.collection.models, 'cid');
                }
            });


            View.ContractView = Marionette.ItemView.extend({
                template: contract,
                events: {
                    //  "click button.js-new": "addComment"
                },
                templateHelpers:function(){
                    var total = this.collection.length;
                    return {
                        contracts:this.collection.models,
                        titleContract: total > 1 ? total + ' Contracts' : total + ' Contract'
                    }
                },
                flash: function(cssClass){
                    var $view = this.$el;
                    $view.hide().toggleClass(cssClass).fadeIn(function(){
                        setTimeout(function(){
                            $view.toggleClass(cssClass)
                        }, 2000);
                    });
                }

            });


            View.Calendar = Marionette.ItemView.extend({
                template: main,
                events: {
                },
                triggers:{
                    //"click a.js-guid":"contract:guidSet"
                },
                initialize: function () {

                },
                onRender:function(){
                    var self = this;
                    this.$form = this.$('form.hidden');
                   // var today = new Date(),
                     //   date = new Date(),
                       // test = new Date(date.getFullYear(), date.getMonth(), 8),
                      var  now = new Date(Moment().format('ddd MMM DD YYYY HH:mm:ss')),
                        lastmonth = new Date(Moment().subtract(1,'M').format('MMM YYYY HH:mm:ss')),
                        nextmonth = new Date(Moment().add(1,'M').format('MMM YYYY HH:mm:ss'));
                    var events = [];
                    $.each(self.collection.models,function(key,value){
                      //  console.log(JSON.stringify(value.attributes.dateNotify));
                       // var type = value.get('contractType');
                        //var date = +new Date(Moment.utc(value.get('dateNotify')).format('YYYY MM DD'));
                       events.push(+new Date(Moment.utc(value.get('dateNotify')).format('YYYY MM DD')));
                    });
                    console.log(JSON.stringify(events));
                    function onChange() {
                      /**  var changed = Moment(kendo.toString(this.value()));**/
                        console.log("Change :: " + Moment(kendo.toString(this.value())).format('YYYY/MM/DD'));

                    }

                    function onNavigate() {
                        console.log("Navigate: "+ JSON.stringify(this.value()));
                        /**  var changed = Moment(kendo.toString(this.value()));
                     var calendarLeft = $("#calendar-left").data("kendoCalendar");
                        var calendar = $("#calendar").data("kendoCalendar");
                        var calendarRight = $("#calendar-right").data("kendoCalendar");
                       calendarLeft.navigateToFuture();
                       calendar.navigateToFuture();
                        calendarRight.navigateToFuture();**/
                    }

                   // console.log(lastmonth + '  '+ nextmonth+ ' Now:'+now+' Test:'+ test);
                 //   console.log(JSON.stringify(event));
                    this.$el.find("#calendar-left").kendoCalendar({
                        value: lastmonth,
                        change: onChange,
                        navigate: onNavigate,
                        dates: events,
                        footer:false,
                        month: {
                            // template for dates in month view
                            content: '# if ($.inArray(+data.date, data.dates) != -1) { #' +
                            '<div class="' +
                            '# if (data.value < 10) { #' +
                            "exhibition" +
                            '# } else if ( data.value < 20 ) { #' +
                            "party" +
                            '# } else { #' +
                            "cocktail" +
                            '# } #' +
                            '">#= data.value #</div>' +
                            '# } else { #' +
                            '#= data.value #' +
                            '# } #'
                        }
                    });
                    this.$el.find("#calendar").kendoCalendar({
                        value: now,
                        change: onChange,
                        navigate: onNavigate,
                        dates: events,
                        footer:false,
                        month: {
                            // template for dates in month view
                            content: '# if ($.inArray(+data.date, data.dates) != -1) { #' +
                            '<div class="' +
                            '# if (data.value < 10) { #' +
                            "exhibition" +
                            '# } else if ( data.value < 20 ) { #' +
                            "party" +
                            '# } else { #' +
                            "cocktail" +
                            '# } #' +
                            '">#= data.value #</div>' +
                            '# } else { #' +
                            '#= data.value #' +
                            '# } #'
                        }
                    });
                    this.$el.find("#calendar-right").kendoCalendar({
                        value: nextmonth,
                        change: onChange,
                        navigate: onNavigate,
                        dates: events,
                        footer:false,
                        month: {
                            // template for dates in month view
                            content: '# if ($.inArray(+data.date, data.dates) != -1) { #' +
                            '<div class="' +
                            '# if (data.value < 10) { #' +
                            "exhibition" +
                            '# } else if ( data.value < 20 ) { #' +
                            "party" +
                            '# } else { #' +
                            "cocktail" +
                            '# } #' +
                            '">#= data.value #</div>' +
                            '# } else { #' +
                            '#= data.value #' +
                            '# } #'
                        }
                    });

                },

                flash: function(cssClass){
                    var $view = this.$list;
                    $view.hide().toggleClass(cssClass).fadeIn(function(){
                        setTimeout(function(){
                            $view.toggleClass(cssClass)
                        }, 2000);
                    });
                }
            });






        });

        return AppManager.DashboardApp.Show.View;
    });
