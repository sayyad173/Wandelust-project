const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paassportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
    email:{
        type:String,
        require:true
    }
})

userSchema.plugin(paassportLocalMongoose); // ye pluging automatically username,hashing,salting empliment kr deta hai
module.exports = mongoose.model('User', userSchema);