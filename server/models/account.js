var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

// mongoose: connect to user dbs
mongoose.connect('mongodb://localhost:27017/passport_local_mongoose');
var Account = new Schema({
    username: String,
    password: String,
    attempts: Number,
    roles:[]
});
var options = {
    limitAttempts:true,
    usernameLowerCase:true,
    attemptsField:'attempts',
    incorrectPasswordError:'Incorrect Password',
    incorrectUsernameError:'Incorrect Username'
};
Account.plugin(passportLocalMongoose,options);

module.exports = mongoose.model('Account', Account);
