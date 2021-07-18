let User = require("../models/user");
const flash = require("connect-flash");

exports.user_list = function(req, res, next){
    User.find({}, "username url membership_status").exec(function(err, users){
        if(err) return next(err);
        res.render("user-list", {user: req.user, users: users, error: req.flash("error")});
    });
};

exports.user_detail = function(req, res, next){
    User.findById(req.params.id).exec(function(err, userFound){
        if(err) return next(err);
        if(!userFound){
            req.flash("error", "user id does not exist");
            res.redirect("/users");
        }else{
            res.render("user-detail", {userFound: userFound, user: req.user});
        }
    })
};

exports.user_create_get = function(req, res, next){
    res.send("Not implemented: user_create_get");
};

exports.user_create_post = function(req, res, next){
    res.send("Not implemented: user_create_post");
};