//=====================================
//Blog routes
//=====================================
var express = require("express"),
    router  = express.Router(),
    Blog    = require("../models/post");

router.get("/blog", function(req,res){
    Blog.find({}, function(err, Allblogposts){
        if(err){
            console.log(err);
        } else {
            res.render("blog/index",{blogpost: Allblogposts});
        }
    });
});

router.post("/blog", isLoggedIn, function(req,res){
    var title = req.body.title;
    var content = req.body.content;
    var newPost = {title: title, content: content}

    Blog.create(newPost, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            newlyCreated.author.id = req.user._id;
            newlyCreated.author.username = req.user.username;
            newlyCreated.save();
            res.redirect("/blog");
        }
    });
});

//Order matters!

router.get("/blog/new", isLoggedIn, function(req,res){
    res.render("blog/new");
});

router.get("/blog/:id", function(req,res){
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            res.render("blog/show",{blogpost: foundBlog});
        }
    });
});

router.delete("/blog/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        } else {
            res.redirect("/blog");
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