const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: {type: String, required: true, minLength: 1, maxLength: 50, unique: true},
    last_name: {type: String, required: true, minLength: 1, maxLength: 50},
    username: {type: String, required: true, minLength: 1, maxLength: 50},
    membership_status: {type: String, enum: ["basic", "pro", "admin"], required: true}
});

userSchema.virtual("full_name").get(function(){
    return this.first_name + " " + this.last_name;
});

userSchema.virtual("url").get(function(){
    return "/users/" + this._id;
});

module.exports = mongoose.model("User", userSchema);