var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var cost_values = new Schema({
    runId:          Mixed,
    nodeId:         Mixed,
    columnId:       Number,
    costValueType:  String,
    currencyType:   String,
    costValue:      String,
    currency:       Number
});

//User.plugin(passportLocalMongoose);

module.exports = mongoose.model('CostValues', cost_values);
