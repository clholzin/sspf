var express = require('express');
var router = express.Router();
var moment = require('moment');
var exceljs = require('exceljs');
var _ = require("underscore");
var excelReport = require('excel-report');
var Contract = require('./../models/contract');
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
    console.log('CALLED contract ONCE: '+id);
    req.params.id = id;
    next();
});

router.get('/contract',function(req, res){
    console.log('get contract from mongo /contract');
    Contract.find(function(err,contract) {
       if(err){
            console.log(err);
        }
        res.json(contract);
    });
});
router.post('/contract',function(req, res){
    console.log(req.body);
    console.log('put contract by id to mongo');
    var contract = new Contract(req.body);
    contract.save( function(err, contract) {
        res.status(200).json(contract);
    });
});
router.get('/contract/export',function(req, res){
    console.log('get contract export by id');
    //Contract.findOne( {"_id": req.params.id}, function(err, contract) {
    Contract.find(function(err,contract) {
        console.log(err);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");
        var data ={title:'Contract List',company:'Dassian',address:'6900 E. Camelback Road,Suite 805, Scottsdale, AZ 85251 USA',user_created:'clholzin'};
        data.table1 = [];
        _.each(contract,function(item,key){
            data.table1.push(item);
        });

        var template_file ='./server/templates/original_with_Formulae.xlsx';
        excelReport(template_file,data,function(error,binary){
            if(!error){
                res.end(binary, 'binary');
            }
            if(error){
                res.writeHead(400, {'Content-Type': 'text/plain'});
                //  return  res.write(error);
                console.log(error);
            }
            res.end();
        });
        /**var data ={title:'Voucher List',company:'STP software',address:'56, 13C Street, Binh Tri Dong B ward, Binh Tan district, Ho Chi Minh City',user_created:'TRUONGPV'};
         data.table1 =[{date:new Date(),number:1,description:'description 1',qty:10},{date:new Date(),number:2,description:'description 2',qty:20}]
         var template_file = './server/templates/template.xlsx';
         excelReport(template_file,data,function(error,binary){
            if(error){
                res.writeHead(400, {'Content-Type': 'text/plain'});
                res.end(error);
                console.log(error);
                 return;
            }
          //  res.setHeader('Content-Type', 'application/vnd.openxmlformats');
          //  res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");
        });
         // res.setHeader('Content-Type', 'application/vnd.openxmlformats');
         // res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");
         //res.end(binary, 'binary');
         res.end();
         // res.json(contract);**/
    });
});
router.get('/contract/:id',function(req, res){
    console.log('get contract from mongo by id');
    Contract.findOne( {"_id": req.params.id}, function(err, contract) {
       console.log(err);
      res.json(contract);
    });
});

router.put('/contract/:id',function(req, res){
    console.log(req.body);
    console.log('put collection by id to mongo');
    Contract.where({"_id" : req.params.id}).update({ $set: req.body }, function(err, contract) {
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
