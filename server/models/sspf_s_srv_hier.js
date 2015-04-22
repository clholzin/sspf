var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var guid_hier = new Schema({
    nodeId:        Mixed,
    nodeUp:        Mixed,
    nodeDown:      Mixed,
    nodeLeft:      Mixed,
    nodeRight:     Mixed
});

//User.plugin(passportLocalMongoose);

module.exports = mongoose.model('GuidHier', guid_hier);
