//Setting Up
if(process.env.NODE_ENV != "production"){

  require('dotenv').config() // use for requires env file
}
console.log(process.env.SECRET)


const express = require("express"); // required express
const app = express(); // 
const mongoose = require("mongoose") //required mongoose
const path = require("path");
const method_override = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { rawListeners } = require("process");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const connectFlash = require("connect-flash");
const passport = require("passport")
const LocaltStrategry = require("passport-local")
const User = require("./models/user.js");

//Required Router 
const listingRouter = require("./routes/listings.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")))
app.use(method_override("_method"));
app.engine('ejs', ejsMate);

//---------------MongoDB Connection-----------------

const dbUrl=process.env.ATLASDB_URL;
main().then((res) => {  // call  main function
  console.log("Connection Successful");
}).catch((err) => {
  console.log(err);
})
async function main() { // function for MONGO URL
  await mongoose.connect(dbUrl)
}


const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secrat: process.env.SECRET,
  },
   touchAfter: 24 * 3600,
})

store.on("error",()=>{
  console.log("Errors In Mongo Session Store",err);
})

// ---- Express Session  -------------
const expressOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // exprire time
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true
  }
}
// ------------------------


//------------Basic Route for testing--------------
// app.get("/", (req, res) => { // Basic API for  Test API working
//   res.send("Hii I'm Basic Root");
// })




app.use(session(expressOption))
app.use(connectFlash())
//----Passowrd Authenticayion ---------------
app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocaltStrategry(User.authenticate())) 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// -------------------------------------

//---------------middlware for flash----------------
app.use((req,res,next)=>{
  res.locals.success=req.flash("success")
  res.locals.deleted=req.flash("deleted")
  res.locals.error=req.flash("error")
  res.locals.currUser=req.user;
  next();
})
//---------------------END------------------------------
 //--------------------Router hai------------------------
app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/",userRouter)

// ye agr url qrong huaa wrong req ai aur page na mile to ye middleware chalega
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"))
})

//-------------------Middleware-------------------
app.use((err, req, res, next) => {
  let { status = 500, message = "Something Went Wrong!" } = err;
  res.status(status).render("error", { message })
})

//-------------------port-------------------
app.listen(8080, () => {  
  console.log("Server Working");
});