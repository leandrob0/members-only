const User = require("../models/user");
const Post = require("../models/post");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.get_homepage = (req, res, next) => {
  Post.find()
    .populate("author")
    .exec((err, posts) => {
      if (err) return next(err);
      res.render("index", {
        user: res.locals.currentUser ? res.locals.currentUser : undefined,
        posts: posts,
      });
    });
};

exports.get_sign_up = [
  (req,res, next) => {
    if(req.isAuthenticated()) {
      res.redirect("/");
    } else {
      next();
    }
  },
  (req, res) => {
    res.render("sign-up-form", { user: undefined, errors: undefined });
  }
]

exports.post_sign_up = [
  // Sanitize and validate data.
  body("name_first", "A name longer than 3 characters is required")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("name_last")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("username", "A username must be specified (longer than 3 characters)")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("password", "A password must be specified (longer than 3 characters)")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  async (req, res, next) => {
    // Gets the hashed password and searchs if the inserted username exists already
    const pw = await bcrypt.hash(req.body.password, 10);
    const foundUname = await User.findOne({ username: req.body.username });

    const user = new User({
      name: {
        first: req.body.name_first,
        last: req.body.name_last,
      },
      username: req.body.username,
      password: pw,
      member: false,
      admin: false,
    });

    // Make the validation errors an array.
    const errors = validationResult(req).array();
    // If the username already exists, push it as an error to the array.
    if (foundUname !== null)
      errors.push({ msg: "The username already exists" });

    if (errors.length > 0) {
      res.render("sign-up-form", { user: user, errors: errors });
    } else {
      user.save((err) => {
        if (err) return next(err);
        res.redirect("/log-in");
      });
    }
  },
];

exports.get_log_in = [
  (req,res, next) => {
    if(req.isAuthenticated()) {
      res.redirect("/");
    } else {
      next();
    }
  },
  (req, res) => {
    res.render("log-in-form", {
      user: res.locals.currentUser ? res.locals.currentUser : undefined,
    });
  }
]

// TODO
// I should sanitize the data before trying the log and show the errors.
exports.post_log_in = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
});

exports.log_out = (req, res, next) => {
  req.logout();
  res.redirect("/");
};
