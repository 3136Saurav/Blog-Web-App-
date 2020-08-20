const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const { compile } = require('ejs')
const e = require('express')
const expressSanitizer = require('express-sanitizer')
app = express()

const CONNECTION_URI = process.env.DATABASEURL || "mongodb://localhost/blog_app_1" 
// console.log(CONNECTION_URI)
// const CONNECTION_URI = "mongodb+srv://blog_user:PXHYurd0aXu2njEQ@cluster0.1xfe7.mongodb.net/<dbname>?retryWrites=true&w=majority" 

mongoose.connect(CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true})
const blogSchema = new mongoose.Schema({
                    title: String,
                    image: String,
                    body: String,
                    created: {type: Date, default: Date.now}  
                })
const Blog = mongoose.model("Blog", blogSchema)
// mongoose.set('useFindAndModify', false);


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer())
app.use(methodOverride('_method'))
// Blog.create({
//     title: 'We are one!',
//     image: 'https://images.unsplash.com/photo-1597697367272-129e62496e37?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80',
//     body: 'Sabka Malik Ek!'
// })

app.get('/', (req, res) => {
    res.redirect('/blogs')
})

app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log(err)
        } else {
            res.render('index', {blogs: blogs})
        }
    })
})

app.get('/blogs/new', (req, res) => {
    res.render('new')
})

app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect('/blogs')
        } else {
            res.render('show', {blog: foundBlog})
        }
    })
})

app.post('/blogs', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render('/new')
        } else {
            res.redirect('/blogs')
        }
    })
})

app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect('/blogs')
        } else {
            res.render('edit', {blog: foundBlog})
        }
    })
})

app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if (err) {
            res.redirect('/blogs')
        } else {
            res.redirect('/blogs/' + req.params.id)
        }
    })
})


app.delete('/blogs/:id', async(req, res) => {
    let blog
    try {
        blog = await Blog.findById(req.params.id)
        await blog.remove()
        res.redirect('/blogs')
    } catch {
        res.redirect('/blogs')
    }
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


app.listen(process.env.PORT || 3000, ()=> {
    console.log('Server is running!')
})