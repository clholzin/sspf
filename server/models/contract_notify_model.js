/**
 * Created by craig on 4/30/2015.
 */
var mongoose = require('mongoose'),
   Schema = mongoose.Schema;
var uri = 'mongodb://localhost:27017/sspf';
var db = mongoose.createConnection(uri, { server: { poolSize: 4 }});


var ContNotify = new Schema({
    "user" : {"username" : String},
    "contractId" : {type:String},
    "contractType" : String,
    "dateCreated" : {type:Date,default:Date.now},
    "dateNotify" : Date,
    "year" : Number,
    "status":{
        "reviewed":{ type: Boolean, default: '0'},//send fro approval
        "approved":{ type: Boolean, default: '0'},//reviews
        "submitted":{ type: Boolean, default: '0'}//completed
    },
    "completed":[
       /** {
            "title":{ type: String, default: 'Reporting Plan'},
            "description":{ type: String, default: 'List of reporting data.'},
            "checked":{ type: Boolean, default: '0'}
        },
        {
            "title":{ type: String, default: 'Contract'},
            "description":{ type: String, default: 'Contract basic data.'},
            "checked":{ type: Boolean, default: '0'}
        },
        {
            "title":{ type: String, default: 'Price'},
            "description":{ type: String, default: 'Baseline plan cost.'},
            "checked":{ type: Boolean, default: '0'}
        },
        {
            "title":{ type: String, default: 'Actual Forecast'},
            "description":{ type: String, default: 'Actual and Forecast cost.'},
            "checked":{ type: Boolean, default: '0'}
        },
        {
            "title":{ type: String, default: 'Milestones'},
            "description":{ type: String, default: 'Milestones'},
            "checked":{ type: Boolean, default: '0'}
        }**/
    ]

});

module.exports = db.model('contNotify', ContNotify,'contnotifies');