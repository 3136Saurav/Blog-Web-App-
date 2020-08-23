const mongoose = require("mongoose")
const Blog = require("./models/blog")
const Comment = require("./models/comment")

var data = [
    {
        title: "True Friendship",
        image: "https://d1whtlypfis84e.cloudfront.net/guides/wp-content/uploads/2019/08/09055658/friendship.jpg",
        body: "A person is acquainted with many persons in their life. However, the closest ones become our friends and the world"
    },
    {
        title: "ग्लोबल वार्मिंग",
        image: "https://d1whtlypfis84e.cloudfront.net/guides/wp-content/uploads/2019/08/17095336/climate-change-cold-glacier-2229887-2.jpg",
        body: "ग्लोबल वार्मिंग एक ऐसा शब्द है जिससे लगभग हर कोई परिचित है। लेकिन, इसका अर्थ अभी भी हम में से अधिकां... and thats what I do!"
    },
    {
        title: "Why Facebook is wrong, yet again",
        image: "https://www.hindustantimes.com/rf/image_size_960x540/HT/p2/2020/08/20/Pictures/_eea1df7c-e27b-11ea-b244-d12791e95102.png",
        body: "This debate centres on a lengthy, chilling investigation published last week by The Wall Street Jornal owned by Jeff Bezos founder of Amazon!"  
    },
]

function seedDB() {
    Blog.remove({}, (err) => {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log("Removed Blog!")
    //         data.forEach((seed) => {
    //             Blog.create(seed, (err, blog) => {
    //                 if (err) {
    //                     console.log(err)
    //                 } else {
    //                     console.log("Added a Blog!")
    //                     Comment.create({
    //                         text: "Wohoo this is my first comment!",
    //                         author: "Gary Vaynerchuk"
    //                     }, (err, comment) => {
    //                         if (err) {
    //                             console.log(err)
    //                         } else {
    //                             blog.comments.push(comment)
    //                             blog.save()
    //                             console.log("Added a comment!")
    //                         }
    //                     })
    //                 }
    //             })
    //         })
    //     }
    })
}

module.exports = seedDB