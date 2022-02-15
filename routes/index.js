const express = require('express');
const router = express.Router();

const authController = require("../controllers/authController");

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

module.exports = router;
