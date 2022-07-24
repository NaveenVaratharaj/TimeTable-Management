// Including Dotenv
if(process.env.Node !== 'production'){
    require("dotenv").config()
}

// Required Dependencies
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const session = require("express-session")
const bcrypt = require('bcrypt');
const saltrounds = 7
const passport = require('passport')
require("./auth")


const app = express();

function isLoggedIn(req,res,next){
    req.user ? next() : res.sendStatus(401);
}

// Middleware
app.set("view engine", "ejs")
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))
app.use(passport.initialize());
app.use(passport.session());


// Db connection
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true} , () =>{
    console.log("Database Connected!")
})

app.get("/auth/google",
  passport.authenticate('google', {scope: ['email', 'profile'] })
)

app.get("/google/callback", 
  passport.authenticate('google', {
    successRedirect: "/students",
    failureRedirect: "/auth/failure"
  })  
)

app.get("/auth/failure", (req,res)=>{
    res.send("Something went wrong")
})

app.get("/students", isLoggedIn, (req,res) =>{
    res.render("students_success", {name: req.user.displayName})
})

app.get('/student_logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});

app.get("/", (req,res) =>{
  res.render("home")
})


// Port
app.listen(process.env.PORT || 5000, ()=>{
    console.log("App Started at the ", process.env.PORT)
})