/**Created by craig on 4/30/2015.**/
var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/passport_local_mongoose');
module.exports  = mongoose;