/**
 * Created by craig on 4/30/2015.
 */
var mongoose = require('mongoose'),
    moment = require('moment'),
   Schema = mongoose.Schema;
var uri = 'mongodb://localhost:27017/sspf';
var db = mongoose.createConnection(uri, { server: { poolSize: 4 }});


var Contract = new Schema({
    user: {
        username:{ type: String, lowercase: true},
        role:{}
    },
    newContract:{ type: Boolean, default:1},
    title: String,
    contract:{
        "amount": { type: Number, default: '0'}
    },
    startDate: Date,
    endDate:   Date,
    description: {
        body:String,
        date: Date
    },
    primary:   Boolean,
    comments: [],
      //  { body: String, date: { type: Date, default: Date.now },username: String }
    meta: {date_created: { type: Date, default: Date.now }},
    updated_at: { type: Date, default: Date.now },
    created_at:{ type: Date, default: Date.now },
    pricing: {
        firmPricing: { type: Number, default: '0'},
        fixedPricing: { type: Number, default: '0'},
        costPlusPricing: { type: Number, default: '0' },
        estBasedFee: { type: Number, default: '0' },
        volDrivenPricing: { type: Number, default: '0'},
        targetPricing: { type: Number, default: '0'}
    },
    obligations:{
        version: String,
        changeDate:Date,
        comment:String,
        allowable:Number
    },
    deliverables:[],
    businessUnit:[],//array of names
    reports:{
        cnr:{occurs:[]//array of type:annual date:date year:year
        },
        crp:{occurs:[]
        },
        qcr:{occurs:[]
        },
        icr:{occurs:[/**{type:String,year:String,data:Date}**/]
        },
        ccr:{occurs:[]
        },
        ccs:{occurs:[]
        }
    }
});

module.exports = db.model('Contract', Contract);