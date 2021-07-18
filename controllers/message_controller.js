let Message = require("../models/message");
const flash = require("connect-flash");

exports.message_list = function(req, res, next){
    Message.find({}).populate("user").exec((err, messages) => {
        if(err) return next(err);
        res.render("message-list", {messages: messages, user: req.user, error: req.flash('error')});
    });
};

exports.message_detail = function(req, res, next){
    Message.findById(req.params.id).populate("user").exec(function(err, foundMessage){
        if(err) return next(err);
        if(!foundMessage){
            req.flash("error", "Message id does not exist");
            res.redirect("/messages");
        }else{
            res.render("message-detail", {message: foundMessage, user: req.user});
        }
    })
};

exports.message_create_get = function(req, res, next){
    res.send("Not implemented: message_create_get");
};

exports.message_create_post = function(req, res, next){
    res.send("Not implemented: message_create_post");
};