const express = require('express');
const router = express.Router();

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

// AUTHENTICATION CONTROLLERS.

// GET Homepage.
router.get('/', authController.get_homepage);

// GET Log in form
router.get("/log-in", authController.get_log_in);

// POST Log in form
router.post("/log-in", authController.post_log_in);

// GET Sign up form
router.get("/sign-up", authController.get_sign_up);

// POST Sign up form
router.post("/sign-up", authController.post_sign_up);

// GET Logout of account
router.get("/logout", authController.log_out);

// USER ACTIONS CONTROLLER.

// GET Shows the button to change membership status.
router.get("/member", userController.get_member)

// POST Makes an user a member or removes the membership.
router.post("/member", userController.post_member)

// GET Show the form to create new post.
router.get("/create", userController.get_post_create)

// POST Creates the post.
router.post("/create", userController.post_post_create)


module.exports = router;
