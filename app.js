const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const { compile } = require('ejs')
const e = require('express')
const passport = require("passport")
const LocalStrategy = require("passport-local")
const expressSanitizer = require('express-sanitizer')
const seedDB = require("./seed")
const flash = require("connect-flash")
app = express()

const commentRoutes = require("./routes/comments")
const blogRoutes = require("./routes/blogs")
const indexRoutes = require("./routes/index")

// console.log(process.env.DATABASEURL)

const CONNECTION_URI = process.env.DATABASEURL || "mongodb://localhost/blog_app_1" 
mongoose.connect(CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true})

const Blog = require('./models/blog')
const Comment = require('./models/comment')
const User = require('./models/user')
// mongoose.set('useFindAndModify', false);

// seedDB()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer())
app.use(methodOverride('_method'))
app.use(flash())

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This is secret",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})

app.use("/", indexRoutes)
app.use("/blogs", blogRoutes)
app.use("/blogs/:id/comments", commentRoutes)

app.listen(process.env.PORT || 3000, ()=> {
    console.log('Server is running!')
})

// app.get('/blogs', function(req, res){
//     Blog.find({}, function(err, blogs){
//         if (err) {
//             console.log(err)
//         } else {
//             res.render('index', {blogs: blogs})
//         }
//     })
// })