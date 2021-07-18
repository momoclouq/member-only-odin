var express = require('express');
var router = express.Router();

const bcrypt = require("bcryptjs");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");
const {body, validationResult} = require("express-validator");
const flash = require('connect-flash');
const async = require("async");

const index_controller = require("../controllers/index_controller");

const user_router = require("./users");
const message_router = require("./messages");

const User = require("../models/user");
const Pass = require("../models/pass");

router.use(flash());
router.use(session({secret: "cats", resave: false, saveUninitialized: true}));
router.use(passport.initialize());
router.use(passport.session());

passport.use(
  new localStrategy((username, password, done) => {
    async.series({
      account_pass: function(callback){
        Pass.findOne({username: username}).exec(callback);
      },
      user: function(callback){
        User.findOne({username: username}).exec(callback);
      }
    }, (err, results) => {
      if(err) return next(err);
      if(results.account_pass == null || results.user == null) return done(null, false, {message: "Incorrect username"});
      bcrypt.compare(password, results.account_pass.password, (err, res) =>{
        if(res) return done(null, results.user);
        else return done(null, false, {message: "Incorrect password"});
      });
      //return done(null, results.user);
    })
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
      done(err, user);
  });
});

const checkLoggedin = (req, res, next) => {
  if(req.user != null) res.redirect('/board');
  next();
}

/* GET home page. */
router.get('/',checkLoggedin, function(req, res, next) {
  res.render('index', { title: 'Welcome to Member-only' });
});

router.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/log-in', checkLoggedin, (req, res, next) => {
  res.render("sign-in-form", {message: req.flash('error')});
});

router.post('/log-in', checkLoggedin, passport.authenticate("local", {
  successRedirect: "/board",
  failureRedirect: "/log-in",
  failureFlash: true
}));

router.get('/sign-up', checkLoggedin, (req, res) => res.render("sign-up-form"));

router.post('/sign-up', 
  checkLoggedin,
  body("username").exists().withMessage("username cannot be empty").trim().isLength({min: 1, max: 50}).withMessage("username must be less than 50 characters long"),
  body("password").exists().isLength({min: 8}).withMessage("password must be at least 8 characters long"),
  body("password-re").exists().custom((value, {req}) => {
    return value === req.body.password;
  }).withMessage("password retype must be similar to password"),
  body("first_name").exists().isLength({max: 50}).withMessage("first name must be less than 50 characters long"),
  body("last_name").exists().isLength({max: 50}).withMessage("last name must be less than 50 characters long"),
  (req, res, next) => {
    let errors = validationResult(req);

    if(!errors.isEmpty()){
      res.render("sign-up-form", {errors: errors.array()})
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        const user = new User({
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            membership_status: "basic"
        }).save((err, user) => {
            if(err){
                return next(err);
            }
            let newPass = new Pass({
              username: user.username,
              password: hashedPassword
            }).save(err => {
              if(err) return next(err);
              res.redirect("/log-in");
            });
        });
      });
    }
});

//check log in
const checkLoggedin2 = (req, res, next) => {
  if(req.user == null) res.redirect('/log-in');
  next();
};

//board process
router.get('/board',checkLoggedin2, index_controller.board_get);

router.post('/board',checkLoggedin2, index_controller.board_post);

router.use('/users',checkLoggedin2, user_router);

router.use('/messages',checkLoggedin2, message_router);

module.exports = router;
