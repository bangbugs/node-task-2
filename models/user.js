const mongoose = require('mongoose'),
      bcrypt = require('bcrypt'),
      SALT_ROUNDS = 10,
      { Role } = require('../helpers');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        index: {
            unique: true,
        }
    },
    password: {
        type: String,
        required: true
    },
    salt: String,
    created: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: [String],
        default: [Role.User]
    }
});

userSchema.pre('save', function(next) {
    var user = this;
    if(!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_ROUNDS, function(err, salt){
        if(err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(plainPass, cb){
    bcrypt.compare(plainPass, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

module.exports = mongoose.model("User", userSchema);