define(["app","vendor/moment"], function(AppManager,Moment){
  AppManager.module("Entities", function(Entities, AppManager, Backbone, Marionette, $, _){
    Entities.FilteredCollection = function(options){
      var original = options.collection;
      var filtered = new original.constructor();
      filtered.add(original.models);
      filtered.filterFunction = options.filterFunction;

      var applyFilter = function(filterCriterion, filterStrategy, collection){
        var collection = collection || original;
        var criterion;
        if(filterStrategy == "filter"){
         // criterion = filterCriterion.trim();
            criterion = filterCriterion;
        }
        else{
          criterion = filterCriterion;
        }

        var items = [];
        if(criterion){
          if(filterStrategy == "filter"){
            if( ! filtered.filterFunction){
              throw("Attempted to use 'filter' function, but none was defined");
            }
            var filterFunction = filtered.filterFunction(criterion);
            items = collection.filter(filterFunction);
          }
          else{
            items = collection.where(criterion);
          }
        }
        else{
          items = collection.models;
        }

        // store current criterion
        filtered._currentCriterion = criterion;

        return items;
      };

      filtered.filter = function(filterCriterion){
        filtered._currentFilter = "filter";
        var items = applyFilter(filterCriterion, "filter");

        // reset the filtered collection with the new items
        filtered.reset(items);
        return filtered;
      };

      filtered.where = function(filterCriterion){
        filtered._currentFilter = "where";
        var items = applyFilter(filterCriterion, "where");

        // reset the filtered collection with the new items
        filtered.reset(items);
        return filtered;
      };

      // when the original collection is reset,
      // the filtered collection will re-filter itself
      // and end up with the new filtered result set
      original.on("reset", function(){
        var items = applyFilter(filtered._currentCriterion, filtered._currentFilter);

        // reset the filtered collection with the new items
        filtered.reset(items);
      });

      // if the original collection gets models added to it:
      // 1. create a new collection
      // 2. filter it
      // 3. add the filtered models (i.e. the models that were added *and*
      //     match the filtering criterion) to the `filtered` collection
      original.on("add", function(models){
        var coll = new original.constructor();
        coll.add(models);
        var items = applyFilter(filtered._currentCriterion, filtered._currentFilter, coll);
        filtered.add(items);
      });

      return filtered;
    };

      Entities.CNRdates = function(beginDate){
          var cnrDate = Moment(beginDate).add(1,'M').format('DD/MM/YYYY');
          console.log('CNR DUE DATE: '+cnrDate);
          return cnrDate;
      };


      Entities.QCRdates = function(beginDate,id){
          var qcrObj = [];
          var startDate = beginDate;
          var weekendCheck = function(check){
              if(check.day() === 0){//sunday
                  check.subtract(2,'d');
              }

              if(check.day() === 6){//saturday
                  check.subtract(1,'d');
              }
              return check;
          };
          for(var i = 0;i<=1;i++){
              var qcrFirstQ = Moment(startDate).startOf('quarter').add(i,'y').add(1,'M').subtract(1,"d").endOf('m');
              var qcrSecondQ = Moment(qcrFirstQ).add(3,'M');
              var qcrThirdQ = Moment(qcrSecondQ).add(3,'M');
              var qcrFourthQ = Moment(qcrThirdQ).add(3,'M');
              if(i === 0){
                  var quarter = qcrFirstQ.quarter();
                  console.log('Current quarter:'+ quarter.toString() );
                  switch(quarter.toString() ){
                      case '1' :
                          weekendCheck(qcrSecondQ.endOf('m'));
                          var second2 = qcrSecondQ;
                          var second2_year = qcrSecondQ.format('YYYY');
                          qcrObj.push({contractType:'qcr',contractId:id,dateNotify:second2,
                              year:second2_year,user:{username:'auto'}});
                          console.log('year: '+(1+i)+' Second Quarter QCR Report Submit Date: '+ second2 +' day:'+qcrSecondQ.day() );

                          weekendCheck(qcrThirdQ.endOf('m'));
                          var third3 = qcrThirdQ;
                          var third3_year = qcrThirdQ.format('YYYY');
                          console.log('year: '+(1+i)+' Third Quarter QCR Report Submit Date: '+ third3+' day:'+qcrThirdQ.day() );
                          qcrObj.push({contractType:'qcr',contractId:id,dateNotify:third3,
                              year:third3_year,user:{username:'auto'}});

                          weekendCheck(qcrFourthQ.endOf('m'));
                          var fourth4 = qcrFourthQ;
                          var fourth4_year = qcrFourthQ.format('YYYY');
                          console.log('year: '+(1+i)+' Fourth Quarter QCR Report Submit Date: '+fourth4+' day:'+qcrFourthQ.day() );
                          qcrObj.push({contractType:'qcr',contractId:id,dateNotify:fourth4,
                              year:fourth4_year,user:{username:'auto'}});
                          break;
                      case '2' :
                          weekendCheck(qcrThirdQ.endOf('m'));
                          var third3_2 = qcrThirdQ;
                          var third3_year_2 = qcrThirdQ.format('YYYY');
                          console.log('year: '+(1+i)+' Third Quarter QCR Report Submit Date: '+ third3_2+' day:'+qcrThirdQ.day() );
                          qcrObj.push({contractType:'qcr',contractId:id,dateNotify:third3_2,
                              year:third3_year_2,user:{username:'auto'}});
                          weekendCheck(qcrFourthQ.endOf('m'));
                          var fourth4_2 = qcrFourthQ;
                          var fourth4_year_2 = qcrFourthQ.format('YYYY');
                          console.log('year: '+(1+i)+' Fourth Quarter QCR Report Submit Date: '+ fourth4_2+' day:'+qcrFourthQ.day() );
                          qcrObj.push({contractType:'qcr',contractId:id,dateNotify:fourth4_2,
                              year:fourth4_year_2,user:{username:'auto'}});
                          break;
                      case '3' :
                          weekendCheck(qcrFourthQ.endOf('m'));
                          var fourth4_3 = qcrFourthQ;
                          var fourth4_year_3 = qcrFourthQ.format('YYYY');
                          console.log('year: '+(1+i)+' Fourth Quarter QCR Report Submit Date: '+ fourth4_3+' day:'+qcrFourthQ.day() );
                          qcrObj.push({contractType:'qcr',contractId:id,dateNotify:fourth4_3,
                              year:fourth4_year_3,user:{username:'auto'}});
                          break;
                      case '4' :
                          weekendCheck(qcrFirstQ.endOf('m'));
                          var first = qcrFirstQ.add(1,'y');
                          var first_year = qcrFirstQ.add(1,'y').format('YYYY');
                          console.log('year: '+(1+i)+' First Quarter QCR Report Submit Date: '+ first+' day:'+qcrFirstQ.day() );
                          qcrObj.push({contractType:'qcr',contractId:id,dateNotify:first,
                              year:first_year,user:{username:'auto'}});
                          break;
                  }

              }else{


                  weekendCheck(qcrFirstQ.endOf('m'));
                  var reg1 = qcrFirstQ;
                  var reg1_year = qcrFirstQ.format('YYYY');
                  console.log('year: '+(1+i)+' First Quarter QCR Report Submit Date: '+ reg1+' day:'+qcrFirstQ.day() );
                  qcrObj.push({contractType:'qcr',contractId:id,dateNotify:reg1,
                      year:reg1_year,user:{username:'auto'}});
                  weekendCheck(qcrSecondQ.endOf('m'));
                  var reg2 = qcrSecondQ;
                  var reg2_year = qcrSecondQ.format('YYYY');
                  console.log('year: '+(1+i)+' Second Quarter QCR Report Submit Date: '+ reg2+' day:'+qcrSecondQ.day() );
                  qcrObj.push({contractType:'qcr',contractId:id,dateNotify:reg2,
                      year:reg2_year,user:{username:'auto'}});

                  weekendCheck(qcrThirdQ.endOf('m'));
                  var reg3 = qcrThirdQ;
                  var reg3_year = qcrThirdQ.format('YYYY');
                  console.log('year: '+(1+i)+' Third Quarter QCR Report Submit Date: '+ reg3+' day:'+qcrThirdQ.day() );
                  qcrObj.push({contractType:'qcr',contractId:id,dateNotify:reg3,
                      year:reg3_year,user:{username:'auto'}});

                  weekendCheck(qcrFourthQ.endOf('m'));
                  var reg4 = qcrFourthQ;
                  var reg4_year = qcrFourthQ.format('YYYY');
                  console.log('year: '+(1+i)+' Fourth Quarter QCR Report Submit Date: '+ reg4+' day:'+qcrFourthQ.day() );
                  qcrObj.push({contractType:'qcr',contractId:id,dateNotify:reg4,
                      year:reg4_year,user:{username:'auto'}});
              }

          }
            return qcrObj;
      };


    Entities.BaseModel = Backbone.Model.extend({
        refresh: function(serverData, keys){
            var previousAttributes = this.previousAttributes();
            var changed = this.changedAttributes();

            this.set(serverData);
            if(changed){
                this.set(changed, {silent: true});
                keys = _.difference(keys, _.keys(changed))
            }
            var clientSide = _.pick(previousAttributes, keys);
            var serverSide = _.pick(serverData, keys);
            this.set({
                changedOnServer: ! _.isEqual(clientSide, serverSide)
            }, {silent: true});
        },

        sync: function(method, model, options){
            return Backbone.Model.prototype.sync.call(this, method, model, options);
        }
    });

    var originalSync = Backbone.sync;
    Backbone.sync = function (method, model, options) {
        var deferred = $.Deferred();
        options || (options = {});
        deferred.then(options.success, options.error);

        var response = originalSync(method, model, _.omit(options, 'success', 'error'));

        response.done(deferred.resolve);
        response.fail(function() {
            if(response.status == 401){
                alert("This action isn't authorized!");
            }
            else if(response.status === 403){
                alert(response.responseJSON.message);
            }
            else{
                deferred.rejectWith(response, arguments);
            }
        });

        return deferred.promise();
    };

    /**_.extend(Backbone.Validation.messages, {
        required: 'is required',
        minLength: 'is too short (min {1} characters)'
    });**/

  });

  return AppManager.Entities;
});
