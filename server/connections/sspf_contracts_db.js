/**
 * Created by craig on 4/30/2015.
 */
var mongoose = require('mongoose');
//mongoose.createConnection('mongodb://localhost/sspf');
// single server
var uri = 'mongodb://localhost:27017/sspf';
var db = mongoose.createConnection(uri, { server: { poolSize: 4 }});
//var conn = mongoose.createConnection('mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]', options);
module.exports = db;