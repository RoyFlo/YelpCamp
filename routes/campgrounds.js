var express = require("express");
var router 	= express.Router();
var Campground	= require("../models/campgrounds");
var middleware = require("../middleware");


//INDEX - show all campgrounds
router.get("/", function(req, res){
	//get all campgrounds from db
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log("Something went wrong :(");
			console.log(err);
		}
		else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});


//CREATE - add new campground to db
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form & add to campgrounds array
	var name = req.body.name;
	var price = req.body.price;
	var desc = req.body.description;
	var img = req.body.image;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, price: price, image: img, description: desc, author, author};
	//create new campground and save to db
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		}
		else {
			//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW - shows more info on specific campground
router.get("/:id", function(req, res){
	//find campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err)
		}
		else{
			//console.log("FOUND" + foundCampground);
			//render SHOW
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT CAMPGROUND
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});		
	});
});

// UPDATE CAMPGROUND
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
	//find and update correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

// DESTROY CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;