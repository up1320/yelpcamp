var express = require("express")
var app = express()
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var Campground = require("./models/campgrounds") 
var Comment = require("./models/comment")
var seedDB = require("./seeds")
var passport = require("passport")
var LocalStrategy = require("passport-local")
var User = require("./models/Users")
//var campgroundRoutes = require("./routes/camp.js")
//var commentRoutes = require("./routes/comment")
//var authRoutes = require("./routes/auth")
var methodOverride = require("method-override")

mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true,useUnifiedTopology: true })
app.use(bodyParser.urlencoded({extended: false}))
app.use(methodOverride("_method"))
app.set("view engine","ejs")
app.use(express.static(__dirname+"/public"))
//cseedDB();

//app.use(campgroundRoutes)
//app.use(authRoutes)
//app.use(commentRoutes)

//Passport Config
app.use(require("express-session")({
    secret:"Rusty is the cutest dog",
    resave:false,
    saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(function(req,res,next){
    res.locals.currentUser = req.user
    next()
})


app.get("/",function(req,res){
    res.render("home")
})

app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log("An error has occured")
        }
        else{
            res.render("campgrounds/index",{campgrounds:campgrounds})
        }
    })
})

app.post("/campgrounds",isLoggedIn,function(req,res){
    
    var name= req.body.name
    var image= req.body.image
    var description = req.body.description
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newCampground = {name:name,image:image,description:description,author:author}
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log("An error has occured")
        }else{
            console.log(newlyCreated)
            res.redirect("/campgrounds") 
        }
    })
    
    
    
})

app.get("/campgrounds/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new.ejs")
})

app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err)
        }else{
            console.log(foundCampground)
            res.render("campgrounds/show",{campground:foundCampground})
           
        }
    })
    
   
})

app.get("/campgrounds/:id/comments/new",isLoggedIn,function (req,res) {
    Campground.findById(req.params.id,function (err,campground) {
        if(err){
            console.log(err)
        }
        else{
            res.render("comments/new",{campground:campground})
        }
    })
    
})

app.post("/campgrounds/:id/comments",isLoggedIn,function (req,res) {
    Campground.findById(req.params.id,function (err,campground) {
        
        if(err){
            console.log(err)
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err)
                }else{
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    comment.text = tes;
                    console.log(test)
                    comment.save()
                    campground.comments.push(comment)
                    campground.save()
                    
                    res.redirect("/campgrounds/"+ campground._id)
                }
            })
        }
    })
    
})


app.get("/register",function(req,res){
    res.render("register")
})

app.post("/register",function(req,res){
   
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            
            return res.render("register")
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds")
        })
    })
})

//Login Route
app.get("/login",function(req,res){
    res.render("login")
})

app.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){

})

//logout route

app.get("/logout",function(req,res){
    req.logout()
    res.redirect("/campgrounds")
})


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

app.listen(3000,function(){
    console.log("Server is Up and Running")
})


