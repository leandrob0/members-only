require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

// Database set.
const mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Route to be used.
const indexRouter = require("./routes/index");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Session setup
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    // To persist session and session data on the database the default memory storage is not recommended bc memory leaks
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    },
  })
);

// Passport setup
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }).exec((err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: "Incorrect username" });

      // Compares the password passed in the login form, with the hashed and salted one in the db.
      bcrypt.compare(password, user.password, (err, res) => {
        // Error on the operation.
        if (err) return done(err);
        // The passwords don't match
        if (!res) return done(null, false, { message: "Incorrect password" });
        // The passwords match, everything ok.
        return done(null, user);
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id).exec((err, user) => {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

// Access the user object from anywhere in the app.
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Route use

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
