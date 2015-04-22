var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var cost_column_headers = new Schema({
    runId:          Mixed,
    columnId:       Mixed,
    fiscalYear:     Number,
    intervalType:   Number,
    intervalValue:  Number,
    intervalStart:  Number,
    intervalEnd:    Number,
    description:    String,
    dataStatusFlag: Number
});

//User.plugin(passportLocalMongoose);

module.exports = mongoose.model('CostColumnHeaders', cost_column_headers);
