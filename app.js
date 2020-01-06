const port 				= process.env.PORT || 3000;
const express 			= require("express"),
	  app 				= express(),
  	  bodyParser		= require("body-parser"),
	  mongoose 			= require("mongoose"),
	  passport 			= require("passport"),
	  LocalStrategy 	= require("passport-local"),
	  methodOverride	= require("method-override"),
	  flash 			= require("connect-flash");

// REQUIRING ROUTES
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes 		= require("./routes/index");

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/yelp_camp_12", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

var Campground 	= require("./models/campgrounds"),
	seedDB 		= require("./seeds"),
	Comment		= require("./models/comments"),
	User 		= require("./models/user");

app.use(express.static(__dirname + "/public"));	
//seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Harry is the cutest",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// sets variable for all files
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


app.listen(port, function(){
	console.log("Server running on port: " + port);
});