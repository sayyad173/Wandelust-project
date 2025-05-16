
const User = require("../models/user")

module.exports.getSignup =  (req, res) => {
    res.render("users/signup.ejs")
}

module.exports.signup =async (req, res,next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({
            email, username
        })
        const userRegistered = await User.register(newUser, password)
        console.log(userRegistered);
        req.login(userRegistered, (err) => {
            if(err){

                return next(err);
            }
            req.flash("success", "User Was Successfuly Registered")
            res.redirect("/listings")
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }
}


module.exports.renderLogin =  (req, res) => {
    res.render("users/login.ejs")
}


module.exports.login = async (req, res) => {
    req.flash("success", "Welcome Back To Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "Logout");
        res.redirect("/listings")
    })
}