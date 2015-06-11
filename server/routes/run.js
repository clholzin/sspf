var express = require('express');
var router = express.Router();
var moment = require('moment');
var RunId = require('./../models/runId');
// middleware specific to this router
console.log('hit RunId routes');

router.param('id', function (req, res, next, id) {
    console.log('CALLED runId ONCE: '+id);
    req.params.id = id;
    next();
});


router.get('/runId/:id',function(req, res){
    console.log('put collection by id to mongo');
    RunId.findOne({"contractId" : req.params.id},{"hierarchy":1,"_id":0}, function(err, runData) {
        if(err){
            console.log(err);
        }
        console.log('rundId data:'+ runData);
        res.status(200).json(runData);
    });
});


router.get('/runId/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
