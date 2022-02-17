const User = require("../models/user");
const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.get_member = (req, res, next) => {
  res.render("change-membership", {
    user: res.locals.currentUser,
    errors: undefined,
  });
};

exports.post_member = (req, res, next) => {

  if (req.body.remove_member !== undefined) {
    const user = new User({
      ...res.locals.currentUser,
      member: !res.locals.currentUser.member,
      _id: res.locals.currentUser._id,
    });

    User.findByIdAndUpdate(
      res.locals.currentUser._id,
      user,
      {},
      (err, user) => {
        if (err) return next(err);
        res.redirect("/");
      }
    );
  } else {
    if (req.body.member_password === "getmembership" && typeof req.body.member_password === 'string') {
      const user = new User({
        ...res.locals.currentUser,
        member: !res.locals.currentUser.member,
        _id: res.locals.currentUser._id,
      });

      User.findByIdAndUpdate(
        res.locals.currentUser._id,
        user,
        {},
        (err, user) => {
          if (err) return next(err);
          res.redirect("/");
        }
      );
    } else {
      res.render("change-membership", {
        user: res.locals.currentUser,
        errors: [{ msg: "The password is not correct." }],
      });
    }
  }
};

exports.get_post_create = (req, res, next) => {
  res.render("post-form", {
    user: res.locals.currentUser,
    post: undefined,
    errors: undefined,
  });
};

exports.post_post_create = [
  // Sanitize and validate data.
  body("title", "A title longer than 3 characters is required")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("text", "A text longer than 3 characters is required")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const post = new Post({
      title: req.body.title,
      text: req.body.text,
      timestamp: Date.now(),
      author: res.locals.currentUser,
    });

    if (!errors.isEmpty()) {
      res.render("post-form", {
        user: res.locals.currentUser,
        post: post,
        errors: errors.array(),
      });
    } else {
      post.save((err) => {
        if (err) return next(err);
        res.redirect("/");
      });
    }
  },
];
