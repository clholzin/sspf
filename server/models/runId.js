/**
 * Created by craig on 4/30/2015.
 */
var mongoose = require('mongoose'),
    moment = require('moment'),
   Schema = mongoose.Schema;
var uri = 'mongodb://localhost:27017/sspf/';
var db = mongoose.createConnection(uri, { server: { poolSize: 4 }});
/**db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
   console.log(callback);
});**/

var runId = new Schema({

});

module.exports = db.model('runId', runId,'runId');