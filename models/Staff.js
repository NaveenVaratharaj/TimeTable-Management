const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require("passport")
const LocalStrategy = require("passport-local")
const passportLocalMongoose = require("passport-local-mongoose")

// Connecting to the DB
mongoose.connect("mongodb://localhost:27017/prodb",  { useUnifiedTopology:true});


// Creation of schema
const staffSchema = new mongoose.Schema({
    username: String,
    password: String
})

staffSchema.pre("save", function(next) {
    if(!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

staffSchema.methods.comparePassword = function(plaintext, callback) {
    return callback(null, bcrypt.compareSync(plaintext, this.password));
};

//Staff Model
const Staff = mongoose.model('Staff', staffSchema)
 
module.exports = Staff
