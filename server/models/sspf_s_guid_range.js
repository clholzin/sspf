var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var guid_range = new Schema({
    sign:       String,
    option:     String,
    low:        Mixed,
    high:       Mixed
});

//User.plugin(passportLocalMongoose);

module.exports = mongoose.model('GuidRange', guid_range);
