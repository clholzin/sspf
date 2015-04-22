var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var guid_def = new Schema({
    guId:          Mixed,
    guiType:       Number,
    externalName:  String,
    internalName:  String
});

//User.plugin(passportLocalMongoose);

module.exports = mongoose.model('GuidDef', guid_def);
