define(["app",
        "tpl!apps/contracts/list/templates/layout.html",
        "tpl!apps/contracts/list/templates/panel.html",
        "tpl!apps/contracts/list/templates/none.tpl",
        "tpl!apps/contracts/list/templates/list.tpl",
        "tpl!apps/contracts/list/templates/list_item.html",
        "vendor/kendoUI/kendo.all.min","kendo.backbone","localstorage"],
       function(AppManager, layoutTpl, panelTpl, noneTpl, listTpl, listItemTpl){
  AppManager.module("ContractsApp.List.View", function(View, AppManager, Backbone, Marionette, $, _){
    View.Layout = Marionette.LayoutView.extend({
      template: layoutTpl,
      regions: {
        panelRegion: "#panel-region",
        contractsRegion: "#contracts-region"
      },
        onShow:function(){
            this.$el.parent().removeClass('fadeIn').addClass('fadeIn');
        },
        onBeforeDestroy :function(){
            this.$el.parent().addClass('fadeIn').removeClass('fadeIn');
        }
    });

    View.Panel = Marionette.ItemView.extend({
      template: panelTpl,
      className:'container-fluid',
      triggers: {
        "click button.js-new": "contract:new"
      },

      events: {
        "submit #filter-form": "filterContracts",
          "click .js-export": "excelExport"
      },

      ui: {
        criterion: "input.js-filter-criterion"
      },
      excelExport:function(){

          alert('Downloading');
          return window.location.open= window.location.origin+'/api/contract/export';
          /**$.ajax({
              url:'http://localhost:8000/api/contract/export',
              method:'GET',
              statusCode: {
                  404: function () {
                      alert("page not found");
                  }
              }
          }).done(function(response){

              alert('downloading');
          }).fail(function(response) {
              alert( "error: "+JSON.stringify(response) );
          });**/
      },
      filterContracts: function(e){
        e.preventDefault();
        var criterion = this.$(".js-filter-criterion").val();
        this.trigger("contracts:filter", criterion);
      },

      onSetFilterCriterion: function(criterion){
        this.ui.criterion.val(criterion);
      }
    });

     /** var DestroyWarn = Marionette.Behavior.extend({
          // You can set default options
          // just like you can in your Backbone Models.
          // They will be overridden if you pass in an option with the same key.
          defaults: {
              "message": "You are destroying!"
          },

          // Behaviors have events that are bound to the views DOM.
          events: {
              "click @ui.destroy": "warnBeforeDestroy"
          },

          warnBeforeDestroy: function() {
              alert(this.options.message);
              // Every Behavior has a hook into the
              // view that it is attached to.
              this.view.destroy();
          }
      });**/
     var NoContractsView = Marionette.ItemView.extend({
         template: noneTpl,
         tagName: "tr",
         className: "alert"
     });



    View.Contract = Marionette.ItemView.extend({
      tagName: "div",
      template: listItemTpl,
       initialize:function(attributes, options){
           // console.log(JSON.stringify(attributes.model.attributes));
            this.options = options;
        },
        onRender:function(){
            var self = this;
            self.$el.find('#chart').toggleClass('hidden');
            var cardsAni = self.$el.find('.thumbnail');
            cardsAni.hide();
            setTimeout(function(){
                $.each(cardsAni,function(index, element){
                    var wait = index+150;
                    setTimeout(function(){
                        cardsAni.show().toggleClass('animated fadeIn');
                    },wait*2);
                });
            },500);
            var pricing = this.model.get('pricing');
            if(pricing.targetPricing === 0){
                this.$el.find("#chart").prepend('<div class="well well-sm" style="min-height:200px;">No Pricing Data</div>').removeAttr('style');
            }else {
                this.$el.find("#chart").kendoChart({
                    title: {
                        position: "top",
                        text: "Pricing Analysis"
                    },
                    legend: {
                        visible: true,
                        position: "top"
                    },
                    chartArea: {
                        background: ""
                    },
                    seriesDefaults: {
                        labels: {
                            visible: false,
                            position: "outsideEnd",
                            background: "transparent",
                            template: "#= category #: \n #= value#%"
                        }
                    },
                    series: [{
                        type: "pie",
                        startAngle: 150,
                        data: [{
                            category: "Target",
                            value: pricing.targetPricing,
                            color: "#ff9800"
                        }, {
                            category: "Volume Driven",
                            value: pricing.volDrivenPricing,
                            color: "#34d800"
                        }, {
                            category: "Fixed",
                            value: pricing.fixedPricing,
                            color: "#36bbce"
                        }, {
                            category: "Firm",
                            value: pricing.firmPricing,
                            color: "#983fd5"
                        }, {
                            category: "Estimated",
                            value: pricing.estBasedFee,
                            color: "#ff7340"
                        }]
                    }],
                    tooltip: {
                        visible: true,
                        format: "${0}"
                    }
                });
               // this.$el.kendoChart.resize(true);
                //http://docs.telerik.com/kendo-ui/using-kendo-in-responsive-web-pages
            }//end prcing object check
        },
      templateHelpers:function(){
        return {
            "_id": this.model.get('_id')
            //username: this.model.get("username")
        }
      },
      triggers: {
        "click td a.js-show": "contract:show",
        "click td a.js-edit": "contract:edit",
        "click button.js-delete": "contract:delete"
      },
      events: {
        "click": "highlightName",
          "click button.js-chart": "hideChart"
      },
      flash: function(cssClass){
        var $view = this.$el;
        $view.hide().toggleClass(cssClass).fadeIn(800, function(){
          setTimeout(function(){
            $view.toggleClass(cssClass)
          }, 500);
        });
      },
      hideChart: function(e){
        var self = this;
        var btn = self.$(e.currentTarget);
        btn.toggleClass('btn-info btn-default');
        self.$el.find('#chart').toggleClass('hidden animated fadeIn');
      },
      highlightName: function(e){
        this.$el.toggleClass("warning");
      },
      remove: function(){
        var self = this;
        this.$el.fadeOut(function(){
          Marionette.ItemView.prototype.remove.call(self);
        });
      }
    });



    View.Contracts = Marionette.CompositeView.extend({
      tagName: "div",
      className: "container-fluid row",
      template: listTpl,
      emptyView: NoContractsView,
      childView: View.Contract,
      childViewContainer: "#panel",

      initialize: function(){
          var self = this;

          self.$localStorageSupport = (('localStorage' in window && window['localStorage'] !== null));
          self.$initialData = self.collection.models; //initial items order (used if there is no saved data
          if ( self.$localStorageSupport) {
              //retrieve local storage data if such is available, else use the default order
              // self.$data = JSON.parse(localStorage.getItem("sortableData")) || self.$initialData;
              self.$old = JSON.parse(localStorage.getItem("sortableData"));
              console.log(self.$old);
              var models;
              if(self.$old != [] ){
                  _.toArray(self.$old);
                  _.each(self.$old,function(item,index){
                    //  console.log(index+'   '+item._id);
                      var model = self.collection.get(item.id);
                      if(model){
                          self.collection.remove(model);
                          self.collection.add(item,{at:index});
                      }
                  });
                   models = self.collection.models;
                  var sorted = _.toArray(models);
                  localStorage.setItem("sortableData", kendo.stringify(sorted));
              }else{
                   models = self.collection.models;
              }
            /**  var ordered =  _.sortBy(models, function(num) {
                  return num *-1;
              });**/

              self.$data = JSON.parse(localStorage.getItem("sortableData"));
          } else {
              alert("your browser does not support local storage");
              self.$data = self.$initialData;
          }

        this.listenTo(this.collection, "reset", function(){
          this.attachHtml = function(collectionView, childView, index){
            collectionView.$el.append(childView.el);
          }
        });
      },
      onRenderCollection: function(){
        this.attachHtml = function(collectionView, childView, index){
          collectionView.$el.find('.sortable').prepend(childView.el);
        };//end attachHTML
      },
      onRender:function(){
           var self = this;
          //Descending Order:
         /** _.sortBy(self.collection, function(num) {
              return num*-1
          });**/
            // html = kendo.render(kendo.template($("#tmp").html()), data); //render the HTML with the data
            //$("#sortable").html(html); //append the HTML to the Sortable container
            self.$el.find(".sortable").kendoSortable({ //initialize the sortable widget
                cursor: "move",
              change: function(e) {
                     var item = self.$data.splice(e.oldIndex, 1)[0]; //remove the item that has changed its order
                  self.$data.splice(e.newIndex, 0, item); //add the item back using the newIndex
                 var sorted = _.toArray(self.$data);
                  sorted.reverse();
                  localStorage.setItem("sortableData", JSON.stringify(sorted));//set the updated data in the local storage
                  var model = {};
                  _.each(self.$data,function(item,index){
                      console.log(index+'   '+JSON.stringify(item));
                      model = self.collection.get(item._id);
                      self.collection.remove(model);
                      self.collection.add(item,{at:index});
                  });
                /**  _.sortBy(self.collection, function(num) {
                      return num;
                  });**/
                },
                placeholder: function(element) {
                    return element.clone().css({
                        "opacity": 0.3,
                        "border": "1px dashed #000000"
                    });
                }
            });

        }
    });
  });

  return AppManager.ContractsApp.List.View;
});


