var express = require('express');
var router = express.Router();
var moment = require('moment');
var Contract = require('./../models/contract');
var ContNotify = require('./../models/contract_notify');
// middleware specific to this router
console.log('hit contract routes');
/**router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});**/
/**
router.get('index', function (req, res) {
//  res.json({ id : req.contract.id,contractname:req.contract.contractname,loggedIn:1});
    console.log('hit index');
});
**/
router.param('id', function (req, res, next, id) {
    console.log('CALLED ONLY ONCE: '+id);
    console.log(req.params);
    next();
});

router.get('/contract',function(req, res){
    console.log('get collection from mongo /contract');
    Contract.find(function(err,contract) {
       if(err){
            console.log(err);
        }
        res.json(contract);
    });
});
router.post('/contract',function(req, res){
    console.log(req.body);
    console.log('put collection by id to mongo');
    var contract = new Contract(req.body);
    contract.save( function(err, contract) {
        res.status(200).json(contract);
    });
});
router.get('/contract/:id',function(req, res){
    console.log('get collection from mongo by id');
    Contract.findOne( {"_id": req.params.id}, function(err, contract) {
       console.log(err);
      res.json(contract);
    });
});

router.put('/contract/:id',function(req, res){
    console.log(req.params.id);
    console.log('put collection by id to mongo');
    Contract.where({"_id" : req.params.id}).update({ $set: { roles: {admin:true} } }, function(err, contract) {
        res.status(200).json(contract);
    });
});
router.delete('/contract/:id',function(req, res){
    console.log(req.params.id);
    console.log('delete collection by id from mongo');
    Contract.where({"_id" : req.params.id}).remove( function(err) {
        res.status(200);
    });
});





router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
