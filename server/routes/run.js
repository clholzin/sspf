var express = require('express');
var router = express.Router();
var moment = require('moment');
var RunId = require('./../models/runId');
var _ = require('underscore');
var selfref = require('self-referential');
// middleware specific to this router
console.log('hit RunId routes');

router.param('id', function (req, res, next, id) {
    console.log('CALLED runId ONCE: '+id);
    req.params.id = id;
    next();
});


router.get('/runId/:id',function(req, res){
    console.log('put collection by id to mongo');
    RunId.findOne({"sapRunId" : req.params.id},{"hierarchy":1,"_id":0}, function(err, runData) {
        if(err){
            console.log(err);
        }
        console.log('rundId data:'+ runData);
        res.status(200).json(runData);
    });
});

router.post('/runId',function(req, res){
  //  console.log(req.body);
   // console.log('post collection to mongo');
    var run = new RunId(req.body);
    run.save(function(err, data) {
        res.status(200).json(data);
    });
});

router.put('/runIdHier/:id',function(req, res){
    console.log('put collection by id to mongo');
    var cfg = {
        selfKey: 'NodeId',
        parentKey: 'NodeUp',
        childrenKey: 'nodes'
    };
    var hierarchy = selfref.toHier(cfg, req.body);
    console.log(hierarchy);
    RunId.where({"contractId" : req.params.id}).update({ $set: {"hierarchy":hierarchy} },function(err,data){
        if(err){
            res.write(err);
        }
        res.status(200).send(data);
    });
});
router.put('/runIdCosts/:id',function(req, res){
    console.log('put collection by id to mongo');
    //{ "item.name": { $eq: "ab" } }
    var id = req.params.id;
    //RunId.find({"contractId" : id},{"hierarchy":1,"_id":0},{$and :{"hierarchy" : {$eq: {"NodeId":req.body.NodeId}}}})
    //{ancestors:"nodes"},
    //  {"hierarchy":{$in:[{"nodes":{$in:[{$elemMatch:{"NodeId":req.body.NodeId}}]}}]}},
    //{"hierarchy":{$elemMatch:{"nodes":{$elemMatch:{"NodeId":{$eq:req.body.NodeId}}}}}},

    //does not error out but does not work either "heirarchy": {$elemMatch:{"NodeId":{$eq:req.body.NodeId}}}
    RunId.find({"contractId" : id,"heirarchy.nodes":{"NodeId":{$eq:req.body.NodeId}}},{"hierarchy":1,"_id":0},
        function(err,data){
            if(err){
                res.send('error: '+err);
            }
            res.json(data);
        });
        /**.update({ $set: req.body },function(err,data){
            if(err){
                res.send(err)
            }
            res.status(200).send(data);
        });**/
});    //RunId.where({"NodeId":{$eq: req.body.NodeId}})
//.where({"hierarchy" : {"NodeId":req.body.NodeId}})
/**
router.put('/runIdHier/:id',function(req, res){
    console.log(req.body);
    console.log('put collection by id to mongo');
    var model = RunId.where({"contractId" : req.params.id});
    _.each(req.body,function(key,value){
        if(key === 0){
            model.update({ $set: {"hierarchy":{"NodeId":value.NodeId}}});
        }
        model.where({"NodeId":value.NodeUp}).update({ $set: {"nodes":[{"NodeId":value.NodeUp}]} });
    });
    res.status(200);
});**/

router.get('/runId/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
