var express = require("express")
var router = express.Router()
var Blog = require('../models/blog')
var User = require('../models/user')

// ====================================
// Blog Routes
// ====================================
router.get('/', (req, res) => {
    // console.log(req.user)
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log(err)
        } else {
            res.render('index', {blogs: blogs})
        }
    })
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('blogs/new')
})

router.get('/:id', (req, res) => {
    Blog.findById(req.params.id).populate("comments").exec((err, foundBlog) => {
        if (err) {
            res.redirect('/blogs')
        } else {
            // console.log(foundBlog)
            res.render('blogs/show', {blog: foundBlog})
        }
    })
})

router.post('/', isLoggedIn, (req, res) => {
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    req.body.blog.body = req.sanitize(req.body.blog.body)
    var new_blog = {title: req.body.blog.title, image: req.body.blog.image, body: req.body.blog.body, author: author} 
    // console.log(req.user)
    // console.log(new_blog)
    
    Blog.create(new_blog, (err, newBlog) => {
        if (err) {
            res.render('blogs/new')
        } else {
            res.redirect('/blogs')
        }
    })
})

router.get('/:id/edit', checkBlogOwnership, (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect('/blogs')
        } else {
            res.render('blogs/edit', {blog: foundBlog})
        }
    })
})

router.put('/:id', checkBlogOwnership, (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if (err) {
            res.redirect('/blogs')
        } else {
            res.redirect('/blogs/' + req.params.id)
        }
    })
})

router.delete('/:id', checkBlogOwnership, async(req, res) => {
    let blog
    try {
        blog = await Blog.findById(req.params.id)
        await blog.remove()
        res.redirect('/blogs')
    } catch {
        res.redirect('/blogs')
    }
})

function checkBlogOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Blog.findById(req.params.id, (err, foundBlog) => {
            if (err) {
                req.flash("error", "Blog not found!")
                res.redirect("back")
            } else {
                if (foundBlog.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash("error", "You don't have permission to do that!")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "Please Login First!")
        res.redirect(back)
    }
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash("error", "Please Login First!")
    res.redirect("/login")
}

module.exports = router
