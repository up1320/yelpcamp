var mongoose = require("mongoose")
var Campground = require("./models/campgrounds")
var Comment = require("./models/comment")
var data = [
    {
        name:"Ooty",
        image:"https://img.traveltriangle.com/blog/wp-content/uploads/2020/01/Ooty-In-Summer-cover_17th-Jan.jpg",
        description:"In kerela"
    },
    {
        name:"knowwhere",
        image:"https://www.holidify.com/images/bgImages/MANALI.jpg",
        description:"this is a good place to visit"
    },
    {
        name:"Shimla",
        image:"https://static.toiimg.com/thumb/38198211.cms?resizemode=75&width=1200&height=900",
        description:"A perfect cozy place to visit to take your mind of things"
    }
]
function seedDB() {
    //Remove CampGrounds
    Campground.remove({},function(err){
        if(err){
            console.log(err)
        }else{
            console.log("Removed Campgrounds")
            data.forEach(function(seed){
                Campground.create(seed,function(err,camp){
                    if(err){
                        console.log(err)
                    }else{
                        console.log("added campground")
                        //create a comment
                        Comment.create({
                            text:"I love this Course",
                            author:"Umang"
                        },function(err,comment){
                            if(err){
                                console.log(err)
                            }else{
                                camp.comments.push(comment)
                                camp.save()
                                console.log("Added a comment")
                            }
                            
                        })
                    }
                })
            })
        
        }
    })
    
    
}
module.exports = seedDB
