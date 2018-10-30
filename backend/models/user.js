const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

let userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    phone: String,
    email: String, 
    password: String,
    role: String,
    lastSignIn: Date,
    createdAt: Date
  }
)

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);