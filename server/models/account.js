//var mongoose = require('../connections/user_passport_db'),
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

// mongoose
var db = mongoose.createConnection('mongodb://localhost:27017/passport_local_mongoose');

var Account = new Schema({
    username: String,
    password: String,
    attempts: Number,
    roles:[]
});
var options = {
    limitAttempts:false,
    usernameLowerCase:true,
    attemptsField:'attempts',
    incorrectPasswordError:'Incorrect Password',
    incorrectUsernameError:'Incorrect Username',
    missingUsernameError:'Add your username',
    missingPasswordError:'Add your password',
    attemptTooSoonError:'Too Many Attempts, try again later'
};
Account.plugin(passportLocalMongoose,options);

module.exports = db.model('Account', Account);
