//signup Router
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")
const userController = require("../controllers/users.js")


router.route("/signup")
.get(userController.getSignup)
.post(wrapAsync(userController.signup))

router.route("/login")
.get( userController.renderLogin)
.post( saveRedirectUrl,   
    passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.login)


//post router
router

router.get("/logout", userController.logout)
module.exports = router;