var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var guid_alt_hier = new Schema({
    dpsNodeId:     Mixed,
    altNodeId:     Mixed
});

//User.plugin(passportLocalMongoose);

module.exports = mongoose.model('GuidAltHier', guid_alt_hier);
