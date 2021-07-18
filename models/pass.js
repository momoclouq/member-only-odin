const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const passSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
});

passSchema.index({username:1, password:1}, {unique: true});

module.exports = mongoose.model("Pass", passSchema);