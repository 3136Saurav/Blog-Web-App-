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
app = express()

// console.log(process.env.DATABASEURL)

const CONNECTION_URI = process.env.DATABASEURL || "mongodb://localhost/blog_app_1" 
mongoose.connect(CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true})

const Blog = require('./models/blog')
const Comment = require('./models/comment')
const User = require('./models/user')
// mongoose.set('useFindAndModify', false);

seedDB()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer())
app.use(methodOverride('_method'))

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
    next()
})

app.get('/', (req, res) => {
    res.render('landing')
})

app.get('/blogs', isLoggedIn, (req, res) => {
    // console.log(req.user)
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log(err)
        } else {
            res.render('index', {blogs: blogs})
        }
    })
})

app.get('/blogs/new', isLoggedIn, (req, res) => {
    res.render('blogs/new')
})

app.get('/blogs/:id', isLoggedIn, (req, res) => {
    Blog.findById(req.params.id).populate("comments").exec((err, foundBlog) => {
        if (err) {
            res.redirect('/blogs')
        } else {
            // console.log(foundBlog)
            res.render('blogs/show', {blog: foundBlog})
        }
    })
})

app.post('/blogs', isLoggedIn, (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render('blogs/new')
        } else {
            res.redirect('/blogs')
        }
    })
})

app.get('/blogs/:id/edit', isLoggedIn, (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect('/blogs')
        } else {
            res.render('blogs/edit', {blog: foundBlog})
        }
    })
})

app.put('/blogs/:id', isLoggedIn, (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if (err) {
            res.redirect('/blogs')
        } else {
            res.redirect('/blogs/' + req.params.id)
        }
    })
})

app.delete('/blogs/:id', isLoggedIn, async(req, res) => {
    let blog
    try {
        blog = await Blog.findById(req.params.id)
        await blog.remove()
        res.redirect('/blogs')
    } catch {
        res.redirect('/blogs')
    }
})

//  =============================================
// COMMENTS ROUTE
//  =============================================

app.get("/blogs/:id/comments/new", isLoggedIn, (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            console.log(err)
        } else {
            res.render("comments/new", {blog: foundBlog})
        }
    })
})

app.post("/blogs/:id/comments", isLoggedIn, (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            console.log(err)
            res.redirect("/blogs")
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err)
                } else {
                    foundBlog.comments.push(comment)
                    foundBlog.save()
                    res.redirect(`/blogs/${foundBlog._id}`)
                }
            })
        }
    } )
})

// ==============================================
// AUTH ROUTES
// ==============================================
app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            return res.render("register")
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/blogs")
        })
    })
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
}), (req, res) => {
})

app.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

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