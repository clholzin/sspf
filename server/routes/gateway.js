var http = require('http');
var url = require('url');
var express = require('express');
var gateway = express.Router();
var moment = require('moment');
var requestify = require('requestify');
var proxy = require('proxy-middleware');
var _ = require("underscore");
var excelReport = require('excel-report');
var Contract = require('./../models/contract');
// middleware specific to this gateway
console.log('hit gateway routes');

gateway.param('id', function (req, res, next, id) {
    console.log('CALLED Gateway ONCE: '+id);
    req.params.id = id;
    next();
});
//gateway.use('/sap/SSPF_01_SRV/GuidSet', proxy(url.parse('http://localhost:9000/sap/opu/odata/DSN/SSPF_01_SRV/GuidSet')));
/**
gateway.get('/GuidSet/:id/',function(req,res){
    var id = req.params.id;
    console.log('hit first callback ' +id);
    var data = [];
    var target = 'http://localhost:8002/sap/opu/odata/DSN/SSPF_01_SRV/GuidSet?$filter=GuidType eq '+id+'&$format=json';
    var Url = url.parse(target);
    console.log(Url);
    requestify.request(Url.href,{method: 'GET',type:'JSON'}).then(function(response) {
        // Get the response body
        var csrf_token = response.getHeader('X-csrf-token');
        console.log('hit second callback ' +csrf_token);
        data.push(response.body());
    });
    res.send(data);
});**/
/**
gateway.get('/GuidSet/:id',function(req, res){
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    console.log('get api/GuidSet');
    var Id = req.params.id;
   // var path = '/sap/opu/odata/DSN/SSPF_01_SRV/GuidSet?$filter=GuidType eq '+Id+'&$format=json';
    var path = '%2Fsap%2Fopu%2Fodata%2FDSN%2FSSPF_01_SRV%2FGuidSet%3F%24filter%3DGuidType%20eq%20'+Id+'%26%24format%3Djson';
    return http.get({
        hostname: 'http://localhost',
        port: '8002',
        path: path
    }, function(response) {
       console.log(response.body);
    });

});**/

gateway.get('/HierMapSet/:id',function(req, res){
    console.log('get contract from mongo /HierMapSet');
    var Id = req.params.id;
    var data;
    requestify.get('http://localhost:8002/sap/opu/odata/DSN/SSPF_01_SRV/HierMapSet?$filter=DpsNodeId eq '+Id+'&$format=json')
        .then(function(response) {
        // Get the response body
        response.getBody();
    });
    //res.json(data);
});

gateway.get('/CostValuesSet/:id',function(req, res){
    console.log('get contract from mongo /RunId ');
    var Id = req.params.id;
    var data;
    requestify.get('http://localhost:8002/sap/opu/odata/DSN/SSPF_01_SRV/CostValuesSet?$filter=RunId eq '+Id+'&$format=json')
        .then(function(response) {
        // Get the response body
        response.getBody();
    });
    //res.json(data);
});

gateway.get('/ALTSet/:id',function(req, res){
    console.log('get contract from mongo /RunId ');
    var Id = req.params.id;
    var data;
    requestify.get('http://localhost:8002/sap/opu/odata/DSN/SSPF_01_SRV/ALTSet?$filter=NodeId eq '+Id+'&$format=json')
        .then(function(response) {
        // Get the response body
        response.getBody();
    });
    //res.json(data);
});

gateway.get('/DPSSet/:id',function(req, res){
    console.log('get contract from mongo /RunId ');
    var Id = req.params.id;
    var data;
    requestify.get('http://localhost:8002/sap/opu/odata/DSN/SSPF_01_SRV/DPSSet?$filter=NodeId eq '+Id+'&$format=json')
        .then(function(response) {
        // Get the response body
        response.getBody();
    });
    //res.json(data);
});
/**
 * gateway.get('/gateway/:id',function(req, res){
    console.log('get contract from mongo /contract');
    Contract.find(function(err,contract) {
       if(err){
            console.log(err);
        }
        res.json(contract);
    });
});
gateway.post('/gateway',function(req, res){
    console.log(req.body);
    console.log('put contract by id to mongo');
    var contract = new Contract(req.body);
    contract.save( function(err, contract) {
        res.status(200).json(contract);
    });
});


gateway.put('/gateway/:id',function(req, res){
    console.log(req.body);
    console.log('put collection by id to mongo');
    Contract.where({"_id" : req.params.id}).update({ $set: req.body }, function(err, contract) {
        res.status(200).json(contract);
    });
});
gateway.delete('/gateway/:id',function(req, res){
    console.log(req.params.id);
    console.log('delete collection by id from mongo');
    Contract.where({"_id" : req.params.id}).remove( function(err) {
        res.status(200);
    });
});

**/



gateway.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = gateway;
