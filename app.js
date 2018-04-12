var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),oe
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user");

    var commentRoutes = require("./routes/comments"),
        blogRoutes    = require("./routes/blogs"),
        authRoutes    = require("./routes/index");

mongoose.connect("mongodb://localhost/blog_project");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(require("express-session")({
    secret: "What is the question that has never been asked?",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(blogRoutes);
app.use(commentRoutes);
app.use(authRoutes);

app.listen(3000, function(){
    console.log("The server has started")
});

