const User = require("../models/user");
const Message = require("../models/message");

const {body, validationResult} = require("express-validator");
const async = require("async");

exports.board_get = function(req, res, next){
    Message.find({}).populate("user").exec(function(err, messages){
        if(err) return next(err);
        res.render("board", {messages: messages, user: req.user});
    });
};

exports.board_post = [
    body("title").exists().trim().isLength({min: 1, max: 100}).withMessage("Title must be less than 100 characters long"),
    body("content").exists().isLength({min: 1, max: 300}).withMessage("Content can only be 300 characters long max"),
    (req, res, next) => {
        let errors = validationResult(req);

        let message = new Message({
            title: req.body.title,
            content: req.body.content,
            timestamp: Date.now(),
            user: req.user._id
        });

        if(!errors.isEmpty()){
            res.render("board", {errors: errors, message: message});
            return;
        }else{
            message.save(function(err){
                if(err) return next(err);
                res.redirect("/board");
            });
        }
    }
];
