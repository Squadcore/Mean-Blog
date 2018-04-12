//=================================
// Comments
//=================================

var express = require("express"),
    router  = express.Router(),
    Blog    = require("../models/post"),
    Comment = require("../models/comment");

router.get("/blog/:id/comments/new", isLoggedIn, function(req,res){
    Blog.findById(req.params.id, function(err, blogpost){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new",{blogpost: blogpost})
        }
    });
});

router.post("/blog/:id/comments", isLoggedIn, function(req,res) {
    Blog.findById(req.params.id, function (err, blogpost) {
        if (err) {
            console.log(err);
            res.redirect("/blog");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    blogpost.comments.push(comment);
                    blogpost.save();
                    res.redirect("/blog/" + blogpost._id);

                }
            });
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = router;