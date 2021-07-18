const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    title: {type: String, required: true, minLength: 1, maxLength: 100},
    content: {type: String, required: true, minLength: 1, maxLength: 300},
    timestamp: {type: Date, required: true, default: Date.now},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

messageSchema.virtual("url").get(function(){
    return '/messages/' + this._id;
});

module.exports = mongoose.model("Message", messageSchema);
