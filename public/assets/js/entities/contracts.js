/**
 * Created by craig on 4/29/2015.
 */
define(["app","vendor/moment","apps/config/storage/localstorage"], function(AppManager,Moment){
    AppManager.module("Entities", function(Entities, AppManager, Backbone, Marionette, $, _){
        Entities.Contract = Backbone.Model.extend({
            urlRoot: window.location.origin+"/api/contract",
            idAttribute: "_id",
            na:'N/A',
           defaults: {
               "title":this.na,
               "contract":{
                   "amount":0
               },
               "description":{
                   "body":this.na,
                   "date":Moment().format('YYYY-MM-DD')
               },
               "startDate":Moment().format('YYYY-MM-DD'),
               "endDate":Moment().format('YYYY-MM-DD'),
               "updated_at": Moment().format('YYYY-MM-DD'),
               "date_created" : Moment().format('L'),
               "businessUnitNames":  this.na,
               "pricing":{
                   "fixedPricing":0,
                   "estBasedFee":0,
                   "targetPricing":0,
                   "costPlusPricing":0,
                   "firmPricing":0,
                   "volDrivenPricing":0
               },
               "obligations":{
                   "version":0,
                   "allowable":0,
                   "comment":'Add Comment',
                   "changeDate":Moment()
               },
               "deliverables":{
                  "title":"Need Title",
                   "description":"Need Description",
                   "comment":"Add Comment",
                   "date_created":Moment()
               },
               "comments":[]
        },
       validate: function(attrs, options) {
        var errors = {};
           var now = Moment().format('YYYY/MM/DD');
        if (! attrs.title) {
            //each error hash table is the id of the input field
          errors.contractTitle = "Can not be blank";
        }
       if (!attrs.contract.amount) {
           errors.contractValue = "Must set a contract value.";
       }
        if(!attrs.obligations.changeDate){
            errors.changeDate = "Must set a a date.";
        }
        if (attrs.user.username.length < 2) {
            errors.username = "Too short, more than two characters.";
        }
        if (!attrs.startDate) {
           errors.startDate = "Must set a start date.";
        }
        /**if ( Moment(attrs.startDate).isBefore(now)) {
           errors.startDate = "Date should not be in the past.";
        }**/
           if (!attrs.endDate) {
               errors.endDate = "Must set a end date.";
           }
       /**if ( Moment(attrs.endDate).isBefore(now)) {
           errors.endDate = "Date should not be in the past.";
       }**/
        if( ! _.isEmpty(errors)){
          return errors;
        }
      }
        });
        Entities.Notify = Backbone.Model.extend({
            urlRoot: window.location.origin+"/api/notify",
            idAttribute: "_id",
            defaults:{
                contractType:'Default',
                dateNotify: Moment().format('YYYY/MM/DD'),
                year: Moment().format('YYYY'),
                user:{
                    username:''
                }
            },
            validate: function(attrs, options) {
                var now = Moment().format('YYYY/MM/DD');
                var errors = {};
                if (! attrs.contractType) {
                    errors.contractType = "Contract type can't be blank";
                }
                if (! attrs.dateNotify) {
                    errors.dateNotify = "Must specify date.";
                }
                /**if ( Moment(attrs.dateNotify).isBefore(now)) {
                    errors.dateNotify = "Date should not be in the past.";
                }**/
                if (! attrs.year) {
                    errors.year = "Must specify year.";
                }
                if (attrs.year < Moment().format('YYYY')) {
                    errors.year = "Year should not be in the past.";
                }
                if (attrs.user.username.length < 2) {
                    errors.username = "Must be more than two characters.";
                }
                if (!attrs.user.username) {
                    errors.username = "Enter an assigned user.";
                }
                if( ! _.isEmpty(errors)){
                    return errors;
                }
            }
        });


        Entities.NotifyOne = Backbone.Model.extend({
            urlRoot: window.location.origin+"/api/notifyOne",
            idAttribute: "_id"
        });









        Entities.TreeNode = Backbone.Model.extend({
            initialize: function(){
               // var hier = this.get('hier');
              //  console.log(hier);
                var nodes = this.get('nodes');
               // console.log(nodes);
               // var nodes = hier;
                //console.log('hit model nodes '+nodes);
                if (nodes){
                    this.nodes = new Entities.TreeCollection(nodes);
                    this.unset("nodes");
                }
            }
        });

        Entities.TreeCollection = Backbone.Collection.extend({
            model: Entities.TreeNode
        });

        Entities.TreeNodeCollection = Backbone.Collection.extend({
            initialize: function(models, options) {
                this.url = window.location.origin+'/api/runId/' + options.id;
            },
            //url : window.location.origin+'/api/rundId/',
            model: Entities.TreeNode,
            parse:function(response){
                return response.hierarchy;
            }
        });









        Entities.UsrSet = Backbone.Model.extend({
            idAttribute:'Persnumber',
            urlRoot:window.location.origin+'/sap/ZUSER_SRV/USR01Set'
        });
        //Entities.configureStorage(Entities.Contact);

        Entities.ContractCollection = Backbone.Collection.extend({
            url: window.location.origin+"/api/contract",
            model: Entities.Contract
            //,
           // comparator: "username"
        });
        Entities.NotifyCollection = Backbone.Collection.extend({
            url: window.location.origin+"/api/notify",
            model: Entities.Notify,
            comparator: "contractId"
            /**filterBy: function(attribute,year) {
                var model = this.model;
                filtered = _.filter(function(model) {
                    return model.get(attribute) < year;
                });
                return new this.collection(filtered);
            }**/
        });
        Entities.NotifyCollectionId = Backbone.Collection.extend({
            initialize: function(models, options) {
                this.url = window.location.origin+'/api/notify/' + options.id;
            },
            model: Entities.Notify,
            comparator: function(model) {
                return model.get('dateNotify');
            }
        });
        //Entities.configureStorage(Entities.ContactCollection);

        Entities.UsrSets = Backbone.Collection.extend({
            model: Entities.UsrSet,
            url: window.location.origin+'/sap/ZUSER_SRV/USR01Set',
           parse:function(response){
                return response.d.results;
            }
        });

        var initializeTreeNodes = function(id){
            var trees = new Entities.TreeNodeCollection([],{id: id});
            trees.fetch();
            trees.forEach(function(tree){
                tree.save();
            });
            return trees.models;
        };

        var initializeContracts = function(){
            var contracts = new Entities.ContractCollection();
            contracts.fetch();
            contracts.forEach(function(contract){
                contract.save();
            });
            return contracts.models;
        };

        var initializeNotify = function(id){
            var notifies = new Entities.NotifyCollectionId([],{id: id});
                notifies.fetch();
                    notifies.forEach(function(notify){
                        notify.save();
            });
            return notifies.models;
        };
        var initializeNotifyAll = function(){
            var notifies = new Entities.NotifyCollection( );
            notifies.fetch();
            notifies.forEach(function(notify){
                notify.save();
            });
            return notifies.models;
        };
        var initializeUsrSet = function(){
            var urs = new Entities.UsrSets();
            urs.fetch();
            urs.forEach(function(ur){
                ur.save();
            });
            return urs.models;
        };

        var API = {
            getUsrSetEntities: function(){
                var ursSet = new Entities.UsrSets();
                var defer = $.Deferred();
                ursSet.fetch({
                    success: function(data){
                        defer.resolve(data);
                    }
                });
                var promise = defer.promise();
                $.when(promise).done(function(ursSet){
                    if(ursSet.length === 0){
                        // if we don't have any contacts yet, create some for convenience
                        var models = initializeUsrSet();
                        ursSet.reset(models);
                    }
                });
                return promise;
            },

            getUsrSetEntity: function(id){
                var notify = new Entities.UsrSet({_id: id});
                var defer = $.Deferred();
                setTimeout(function(){
                    notify.fetch({
                        success: function(data){
                            defer.resolve(data);
                        },
                        error: function(data){
                            defer.resolve(undefined);
                            console.log(data);
                        }
                    });
                }, 2000);
                return defer.promise();
            },

            getContractEntities: function(){
                var contracts = new Entities.ContractCollection();
                var defer = $.Deferred();
                contracts.fetch({
                    success: function(data){
                        defer.resolve(data);
                    }
                });
                var promise = defer.promise();
                $.when(promise).done(function(contracts){
                    if(contracts.length === 0){
                        // if we don't have any contacts yet, create some for convenience
                        var models = initializeContracts();
                        contracts.reset(models);
                    }
                });
                return promise;
            },

            getContractEntity: function(id){
                var contract = new Entities.Contract({_id: id});
                var defer = $.Deferred();
                setTimeout(function(){
                    contract.fetch({
                        success: function(data){
                            defer.resolve(data);
                        },
                        error: function(data){
                            defer.resolve(undefined);
                           // console.log(data);
                        }
                    });
                }, 2000);
                return defer.promise();
            },

            getNotifyEntities: function(id){
                //console.log('id for getNofityEntities: '+id);
                var notifies = new Entities.NotifyCollectionId([],{id: id});
                var defer = $.Deferred();
                notifies.fetch({
                    success: function(data){
                        defer.resolve(data);
                    }
                });
                var promise = defer.promise();
                $.when(promise).done(function(notifies){
                    if(notifies.length === 0){
                        console.log('hit empty entities for notify');
                        // if we don't have any contacts yet, create some for convenience
                       var models = initializeNotify(id);
                        notifies.reset(models);
                    }
                });
                return promise;
            },

            getReportTreeEntity: function(id){
                var tree = new Entities.TreeNodeCollection([],{id: id});
                var defer = $.Deferred();
                tree.fetch({
                    success: function(data){
                        defer.resolve(data);
                    }
                });
                var promise = defer.promise();
                $.when(promise).done(function(tree){
                    if(tree.length === 0){
                        console.log('hit empty entities for tree');
                        // if we don't have any contacts yet, create some for convenience
                        var models = initializeTreeNodes(id);
                        tree.reset(models);
                    }
                });
                return promise;
            },
            getNotifyEntitiesAll: function(){
                //console.log('id for getNofityEntities: '+id);
                var notifies = new Entities.NotifyCollection();
                var defer = $.Deferred();
                notifies.fetch({
                    success: function(data){
                        defer.resolve(data);
                    }
                });
                var promise = defer.promise();
                $.when(promise).done(function(notifies){
                    if(notifies.length === 0){
                        console.log('hit empty entities for notify');
                        // if we don't have any contacts yet, create some for convenience
                        var models = initializeNotifyAll();
                        notifies.reset(models);
                    }
                });
                return promise;
            },
            getNotifyEntity: function(id){
                var notify = new Entities.NotifyOne({_id: id});
                var defer = $.Deferred();
                setTimeout(function(){
                    notify.fetch({
                        success: function(data){
                            defer.resolve(data);
                        },
                        error: function(data){
                            defer.resolve(undefined);
                            console.log(data);
                        }
                    });
                }, 1000);
                return defer.promise();
            }
        };

        AppManager.reqres.setHandler("urs:entities", function(){
            return API.getUsrSetEntities();
        });

        AppManager.reqres.setHandler("urs:entity", function(id){
            return API.getUsrSetEntity(id);
        });

        AppManager.reqres.setHandler("contract:entities", function(){
            return API.getContractEntities();
        });

        AppManager.reqres.setHandler("contract:entity", function(id){
            return API.getContractEntity(id);
        });

        AppManager.reqres.setHandler("contract:entity:new", function(){
            return new Entities.Contract();
        });


        /**Notifications api**/
        AppManager.reqres.setHandler("notify:entities", function(id){
            //console.log('reqres: '+id);
            return API.getNotifyEntities(id);
        });
        AppManager.reqres.setHandler("notify:entities:all", function(){
            return API.getNotifyEntitiesAll();
        });
        AppManager.reqres.setHandler("notify:entity", function(id){
            return API.getNotifyEntity(id);
        });
        AppManager.reqres.setHandler("report:entity", function(id){
            return API.getNotifyEntity(id);
        });
        AppManager.reqres.setHandler("notify:entity:new", function(){
            return new Entities.Notify();
        });

        /** Report Data**/
        AppManager.reqres.setHandler("report:tree:entity", function(id){
            return API.getReportTreeEntity(id);
        });
    });

    return ;
});
