var express = require("express")
var router = express.Router()
var passport = require("passport")
var User = require("../models/user")
// ==============================================
// AUTH ROUTES
// ==============================================
router.get('/', (req, res) => {
    res.render('landing')
})

router.get("/register", (req, res) => {
    res.render("register")
})

router.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            // console.log(err)
            req.flash("error", err.message)
            return res.render("register")
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome " + user.username)
            res.redirect("/blogs")
        })
    })
})

router.get("/login", (req, res) => {
    res.render("login")
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
}), (req, res) => {
})

router.get("/logout", (req, res) => {
    req.logout()
    req.flash("success", "Logged you out!")
    res.redirect("/")
})

module.exports = router