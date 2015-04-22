var mongoose = require('mongoose'),
Schema = mongoose.Schema;
// mongoose: connect to user dbs
//mongoose.connect('mongodb://localhost/passport_local_mongoose');

 var User = new Schema({
    username: String,
    role: [],
    attempts: Number,
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', User);