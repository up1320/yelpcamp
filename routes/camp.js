var express = require("express")
var router = express.Router()
var Campground = require("../models/campgrounds")


router.get("/campgrounds",function(req,res){
    Campground.find({},function(err,campgrounds){
        if(err){
            console.log("An error has occured")
        }
        else{
            res.render("campgrounds/index",{campgrounds:campgrounds})
        }
    })
})

router.post("/campgrounds",isLoggedIn,function(req,res){
    
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

router.get("/campgrounds/new",isLoggedIn,function(req,res){
    res.render("campgrounds/new.ejs")
})

router.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err)
        }else{
            
            res.render("campgrounds/show",{campground:foundCampground})
        }
    })
    
   
})


router.get("/campgrounds/:id/edit", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});


router.put("/campgrounds/:id", function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campgrounds, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});



function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}
module.exports = router