/**
 * Created by craig on 4/29/2015.
 * ,"apps/config/storage/localstorage"
 * ,"vendor/moment"
 */
define(["app"], function(AppManager){
    AppManager.module("Entities", function(Entities, AppManager, Backbone, Marionette, $, _){


        Entities.GuidSet = Backbone.Model.extend({
            idAttribute:'Guid',
            urlRoot: window.location.origin+'/sap/SSPF_01_SRV/GuidSet'
        });
        //Entities.configureStorage(Entities.Contact);

        Entities.GuidSets = Backbone.Collection.extend({
            model: Entities.GuidSet,
            initialize: function(models, options) {
            this.url = window.location.origin+"/sap/SSPF_01_SRV/GuidSet?$filter=GuidType eq '"+options.id+"'&$format=json";
            },
           parse:function(response){
                return response.d.results;
            }
        });
        //Entities.configureStorage(Entities.ContactCollection);


        Entities.HierSetMap = Backbone.Model.extend({
            idAttribute:'DpsNodeId',
            urlRoot: window.location.origin+'/sap/SSPF_01_SRV/HierMapSet'
        });

        Entities.HierSetsMap = Backbone.Collection.extend({
            model: Entities.HierSetMap,
            initialize: function(models, options) {
                this.url = window.location.origin+"/sap/SSPF_01_SRV/HierMapSet?$filter=DpsNodeId eq '"+options.id+"'&$format=json";
            },
            parse:function(response){
                return response.d.results;
            }
        });


        Entities.HierSet = Backbone.Model.extend({
            idAttribute:'DpsNodeId',
            urlRoot: window.location.origin+'/sap/SSPF_01_SRV/HierSet'
        });

        Entities.HierSet = Backbone.Collection.extend({
            model: Entities.HierSet,
            initialize: function(models, options) {
                this.url = window.location.origin+"/sap/SSPF_01_SRV/HierSet?$filter=NodeId eq '"+options.id+"'&$format=json";
            },
            parse:function(response){
                return response.d.results;
            }
        });



        Entities.CostSet = Backbone.Model.extend({
           // idAttribute:'RunId',
            urlRoot: window.location.origin+'/sap/SSPF_01_SRV/CostValuesSet'
        });

        Entities.CostSets = Backbone.Collection.extend({
            model: Entities.CostSet,
            initialize: function(models, options) {
                this.url = window.location.origin+"/sap/SSPF_01_SRV/CostValuesSet?$filter=RunId eq '"+options.id+"'&$format=json";
            },
            parse:function(response){
                return response.d.results;
            }
        });


        Entities.DPSSet = Backbone.Model.extend({
            idAttribute:'NodeId',
            urlRoot: window.location.origin+'/sap/SSPF_01_SRV/DPSSet'
        });

        Entities.DPSSets = Backbone.Collection.extend({
            model: Entities.DPSSet,
            initialize: function(models, options) {
                this.url = window.location.origin+"/sap/SSPF_01_SRV/DPSSet?$filter=NodeId eq '"+options.id+"'&$format=json";
            },
            parse:function(response){
                return response.d.results;
            }
        });
        /**var initializeContracts = function(){
            var contracts = new Entities.ContractCollection();
            contracts.fetch();
            contracts.forEach(function(contract){
                contract.save();
            });
            return contracts.models;
        };**/



        var initializeGuidSets = function(id){
            var guids = new Entities.GuidSets([],{id: id});
            guids.fetch();
            guids.forEach(function(guid){
                        guid.save();
            });
            return guids.models;
        };

        var initializeHierSetsMap = function(id){
            var guids = new Entities.HierSetsMap([],{id: id});
            guids.fetch();
            guids.forEach(function(guid){
                guid.save();
            });
            return guids.models;
        };

        var initializeHierSet = function(id){
            var guids = new  Entities.HierSet([],{id: id});
            guids.fetch();
            guids.forEach(function(guid){
                guid.save();
            });
            return guids.models;
        };

        var initializeCostSets = function(id){
            var guids = new Entities.CostSets([],{id: id});
            guids.fetch();
            guids.forEach(function(guid){
                guid.save();
            });
            return guids.models;
        };

        var initializeDPSSets = function(id){
            var guids = new Entities.DPSSets([],{id: id});
            guids.fetch();
            guids.forEach(function(guid){
                guid.save();
            });
            return guids.models;
        };
       /**var initializeUsrSet = function(){
            var urs = new Entities.UsrSets();
            urs.fetch();
            urs.forEach(function(ur){
                ur.save();
            });
            return urs.models;
        };**/

        var API = {

            getGuidSetEntities: function(id){
                //console.log('id for getNofityEntities: '+id);
                var guids = new Entities.GuidSets([],{id: id});
                var defer = $.Deferred();
                guids.fetch({
                    success: function(data){
                        defer.resolve(data);
                    }
                });
                var promise = defer.promise();
                $.when(promise).done(function(guids){
                    if(guids.length === 0){
                        console.log('hit empty entities for getGuidSetEntities');
                        // if we don't have any contacts yet, create some for convenience
                       var models = initializeGuidSets(id);
                        guids.reset(models);
                    }
                });
                return promise;
            },

            getHeirSetMapEntities: function(id){
                //console.log('id for getNofityEntities: '+id);
                var sets = new Entities.HierSetsMap([],{id: id});
                var defer = $.Deferred();
                sets.fetch({
                    success: function(data){
                        defer.resolve(data);
                    }
                });
                var promise = defer.promise();
                $.when(promise).done(function(sets){
                    if(sets.length === 0){
                        console.log('hit empty entities for getHeirSetEntities');
                        // if we don't have any contacts yet, create some for convenience
                        var models = initializeHierSetsMap(id);
                        sets.reset(models);
                    }
                });
                return promise;
            },

            getCostSetEntities: function(id){
                //console.log('id for getNofityEntities: '+id);
                var sets = new Entities.CostSets([],{id: id});
                var defer = $.Deferred();
               sets.fetch({
                    success: function(data){
                        defer.resolve(data);
                    }
                });
                var promise = defer.promise();
                $.when(promise).done(function(sets){
                    if(sets.length === 0){
                        console.log('hit empty entities for getCostSetEntities');
                        // if we don't have any contacts yet, create some for convenience
                        var models = initializeCostSets(id);
                        sets.reset(models);
                    }
                });
                return promise;
            },

            getHierSetEntities: function(id){
                //console.log('id for getNofityEntities: '+id);
                var sets = new Entities.HierSet([],{id: id});
                var defer = $.Deferred();
                sets.fetch({
                    success: function(data){
                        defer.resolve(data);
                    }
                });
                var promise = defer.promise();
                $.when(promise).done(function(sets){
                    if(sets.length === 0){
                        console.log('hit empty entities getHierSetEntities');
                        // if we don't have any contacts yet, create some for convenience
                        var models = initializeHierSet(id);
                        sets.reset(models);
                    }
                });
                return promise;
            },

            getDpsSetEntities: function(id){
                //console.log('id for getNofityEntities: '+id);
                var sets = new Entities.DPSSets([],{id: id});
                var defer = $.Deferred();
                sets.fetch({
                    success: function(data){
                        defer.resolve(data);
                    }
                });
                var promise = defer.promise();
                $.when(promise).done(function(sets){
                    if(sets.length === 0){
                        console.log('hit empty entities for getDpsSetEntities');
                        // if we don't have any contacts yet, create some for convenience
                        var models = initializeDPSSets(id);
                        sets.reset(models);
                    }
                });
                return promise;
            }
           /** getNotifyEntity: function(id){
                var notify = new Entities.Notify({_id: id});
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
            }**/
        };

        /**
         * Entity Sets Above
         *
         Entities.GuidSets
         Entities.HierSetsMap
         Entities.HierSet
         Entities.CostSets
         Entities.DPSSets
         **/


        AppManager.reqres.setHandler("guidSet:entities", function(id){
            return API.getGuidSetEntities(id);
        });

        AppManager.reqres.setHandler("hierSetMap:entities", function(id){
            return API.getHeirSetMapEntities(id);
        });
        AppManager.reqres.setHandler("costSet:entities", function(id){
            return API.getCostSetEntities(id);
        });
        AppManager.reqres.setHandler("hierSet:entities", function(id){
            return API.getHierSetEntities(id);
        });
        AppManager.reqres.setHandler("dpsSet:entities", function(id){
            return API.getDpsSetEntities(id);
        });

    });

    return ;
});
