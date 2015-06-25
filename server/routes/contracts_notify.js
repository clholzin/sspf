var express = require('express');
var router = express.Router();
var moment = require('moment');
var ContNotify = require('./../models/contract_notify_model');//contract_notify_model.js
// middleware specific to this router
console.log('hit ContNotify routes');

router.param('id', function (req, res, next, id) {
    console.log('Contract Notify: '+id);
    //console.log(req.params);
    next();
});


/**
{
contractId:"5547a50b150b7ba823cb222e",
dateNotify:"2015-05-05",
year:2015,
contractType:"icr",
dateCreated:"2015-05-04",
user:{username:"cholzin"}
}
 * **/
router.get('/notify',function(req, res){
    console.log('get collection from mongo /notify');
    console.log('request params notify id '+req.params.id);
    ContNotify.find(function(err,contractNotify) {
       if(err){
            console.log(err);
        }
        res.json(contractNotify);
    });
});
router.post('/notify',function(req, res){
    console.log(req.body);
    console.log('post collection to mongo');
    var notify = new ContNotify(req.body);
    notify.save( function(err, contractNotify) {
        res.status(200).json(contractNotify);
    });
});
router.get('/notify/:id',function(req, res){
    console.log('get collection from mongo by id');
    console.log('id for notify '+req.params.id);//.where('contractId').equals(req.params.id)
    ContNotify.find({"contractId":req.params.id}, function(err, contractNotify) {
        if(err){
            console.log(err);
        }
      res.json(contractNotify);
    });
});


router.get('/notifyOne/:id',function(req, res){
    console.log('get collection from mongo by id');
    console.log('id for notify '+req.params.id);//.where('contractId').equals(req.params.id)
    ContNotify.findOne({"_id":req.params.id}, function(err, contractNotify) {
        if(err){
            console.log(err);
        }
        res.json(contractNotify);
    });
});
router.put('/notifyOne/:id',function(req, res){
    console.log(req.body);
    console.log('put collection by id to mongo');
    ContNotify.where({"_id" : req.params.id}).update({ $set:req.body }, function(err, contractNotify) {
        res.status(200).json(contractNotify);
    });
});



router.put('/notify/:id',function(req, res){
    console.log(req.body);
    console.log('put collection by id to mongo');
    ContNotify.where({"_id" : req.params.id}).update({ $set:req.body }, function(err, contractNotify) {
        res.status(200).json(contractNotify);
    });
});
router.delete('/notify/:id',function(req, res){
    console.log(req.params.id);
    console.log('delete collection by id from mongo');
    ContNotify.where({"_id" : req.params.id}).remove( function(err) {
        res.status(200);
    });
});





router.get('/notify/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
