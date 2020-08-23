var express = require("express")
var router = express.Router({mergeParams: true})
var Blog = require("../models/blog")
var Comment = require("../models/comment")

//  =============================================
// COMMENTS ROUTE
//  =============================================

router.get("/new", isLoggedIn, (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            console.log(err)
        } else {
            res.render("comments/new", {blog: foundBlog})
        }
    })
})

router.post("/", isLoggedIn, (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            console.log(err)
            res.redirect("/blogs")
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error", "Something went wrong!")
                    console.log(err)
                } else {
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    
                    //save comment
                    comment.save()
                    foundBlog.comments.push(comment)
                    foundBlog.save()
                    req.flash("success", "Successfully Added Comment!")
                    res.redirect(`/blogs/${foundBlog._id}`)
                }
            })
        }
    })
})

router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            res.redirect("back")
        } else {
            res.render("comments/edit", {blog_id: req.params.id, comment: foundComment})
        }
    })
})

router.put("/:comment_id", checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect("back")
        } else {
            res.redirect("/blogs/" + req.params.id)
        }
    })
})

router.delete("/:comment_id", checkCommentOwnership, async (req, res) => {
    let comment
    try {
        comment = await Comment.findById(req.params.comment_id)
        await comment.remove()
        req.flash("success", "Successfully Deleted")
        res.redirect('/blogs/' + req.params.id)
    } catch {
        res.redirect('back')
    }
})

function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back")
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash("error", "You don't have permission to do that!")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that!")
        res.redirect(back)
    }
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

module.exports = router