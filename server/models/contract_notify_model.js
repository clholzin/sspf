/**
 * Created by craig on 4/30/2015.
 */
var mongoose = require('mongoose'),
   Schema = mongoose.Schema;
var uri = 'mongodb://localhost:27017/sspf';
var db = mongoose.createConnection(uri, { server: { poolSize: 4 }});


var ContNotify = new Schema({
    "user" : {
        "username" : String
    },
    "contractId" : ObjectId,
    "contractType" : String,
    "dateCreated" : Date.now,
    "dateNotify" : Date,
    "year" : Number
});

module.exports = db.model('ContNotify', ContNotify);