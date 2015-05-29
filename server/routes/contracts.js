var express = require('express');
var router = express.Router();
var moment = require('moment');
var Excel = require("exceljs");
var XLSX = require('xlsx');
var kexcel = require('kexcel');
var fs = require('fs');
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

    });
});
router.get('/contract/:id',function(req, res){
    console.log('get contract from mongo by id');
    Contract.findOne( {"_id": req.params.id}, function(err, contract) {
       console.log(err);
      res.json(contract);
    });
});

router.get('/contract/:id/exportV1',function(req, res){
    var id = req.params.id;
    console.log('get contract export by id: '+ id);
    Contract.findOne( {"_id": id}, function(err, contract) {
        console.log(err);
        if(err) throw err;
        var workbook = XLSX.readFile('./server/templates/demo_qcrM_.xlsx', {cellStyles:true});
       // var worksheetContract = workbook.SheetNames[9];//04_contract
      //  var worksheet = workbook.Sheets[worksheetContract];
         /**  var Changetitle = 'J20';//'Con_1_Title';
        var Changedescript = 'J21';
        var title_cell = worksheet[Changetitle];
        var description_cell = worksheet[Changedescript];**/

      /** _.each(worksheetContract,function(k,v){
          console.log(k + ' : '+ v);
       });**/

       /** var sheet_name_list = workbook.SheetNames;
        sheet_name_list.forEach(function(y) {
            var worksheet = workbook.Sheets[y];
            for (z in worksheet) {
              // all keys that do not begin with "!" correspond to cell addresses
                if(z[0] === '!') continue;
                console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
            }
        });**/
       // console.log(JSON.stringify(worksheet));
       // console.log(worksheet["!ref"]);
      //  console.log(worksheet["!merges"]);
       // console.log(worksheet["!cols"]);

       // console.log(JSON.stringify(title_cell));
        /* Get the value */
       // worksheet[Changetitle] = contract.title;
       // worksheet[Changedescript] = contract.description.body;
        // var desired_value =  desired_cell.v;

      XLSX.writeFile(workbook, './server/templates/demo_qcrM_out.xlsx',{cellStyles:true,bookSST:true});//{bookSST:true}

    //  res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    //    res.setHeader("Content-Disposition", "attachment; filename=./server/templates/demo_qcrM_out.xlsx");

    });


   res.end();
});
router.get('/contract/:id/exportV2',function(req, res){
    var id = req.params.id;
    console.log('get contract export by id: '+ id);
    Contract.findOne( {"_id": id}, function(err, contract) {
        console.log(err);
        if(err) throw err;
        //./server/templates/demo_qcrM_.xlsx
        var template = './server/templates/demo_qcrM_.xlsx';
        var workbook = new Excel.Workbook();
        workbook.xlsx.readFile(template)
            .then(function() {
                var ws = wb.getWorksheet(0);
                console.log(JSON.stringify(ws));

            });

        /** workbook.xlsx.writeFile(filename)
         .then(function() {
                // done
            });**/
    });
    res.end();
});
router.get('/contract/:id/exportV3',function(req, res){
    var id = req.params.id;
    console.log('get contract export by id: '+ id);
    res.setHeader('Content-disposition', 'attachment; filename=test.xlsx');
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    Contract.findOne( {"_id": id}, function(err, contract) {
        console.log(err);
        if(err) throw err;
        //./server/templates/demo_qcrM_.xlsx

       var template = './server/templates/demo_qcrM_.xlsx';
        kexcel.open(template, function(err, workbook) {
            // Get first sheet
            var sheet = workbook.getSheet(5);
            sheet.setCellValue(1,1,'Hello World!');
            sheet.setRowValues(2, ['Hello', 'even', 'more', 'Worlds']);
            sheet.setRowValues(3, [1, '+', 2, 'equals','=A3+C3']);
            // Duplicate a sheet
            var duplicatedSheet = workbook.duplicateSheet(5,'My duplicated sheet');

            // Save the file
           // var output = fs.createWriteStream(__dirname + '/tester.xlsx');

            workbook.pipe(res);
        });

    });
    //res.end();
});
router.get('/contract/:id/exportV4',function(req, res){
    var id = req.params.id;
    console.log('get contract export by id: '+ id);
    res.setHeader('Content-disposition', 'attachment; filename=test.xlsx');
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    Contract.findOne( {"_id": id}, function(err, contract) {
        console.log(err);
        if(err) throw err;
        //./server/templates/demo_qcrM_.xlsx

        //var template = './server/templates/contract_reporting_template.xlsx';
        var template = './server/templates/single_contract_temp.xlsx';

        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=contract_reporting.xlsx");
        var data ={
            id:id,
            title:contract.title,
            value:contract.contract.amount,
            description:contract.description.body,
            startDate:moment.utc(contract.startDate).format('DD/MM/YYYY'),
            endDate:moment.utc(contract.endDate).format('DD/MM/YYYY'),
            firm:parseFloat(contract.pricing.firmPricing).toFixed(2),
            fixed:parseFloat(contract.pricing.fixedPricing).toFixed(2),
            cost:parseFloat(contract.pricing.costPlusPricing).toFixed(2),
            estimate:parseFloat(contract.pricing.estBasedFee).toFixed(2),
            volume:parseFloat(contract.pricing.volDrivenPricing).toFixed(2),
            target:parseFloat(contract.pricing.targetPricing).toFixed(2),
            user_created:'clholzin'
        };

       /** data.table1 = [];
        _.each(contract,function(item,key){
            data.table1.push(item);
        });**/

        excelReport(template,data,function(error,binary){
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

    });
    //res.end();
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
