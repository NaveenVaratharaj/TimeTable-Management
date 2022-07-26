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
const morgan = require('morgan')
var cookieParser = require("cookie-parser");
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
app.use(morgan("dev"));
app.use(cookieParser())

app.use(session({
    key: "user_sid",
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

//Staff Schema
const staffSchema = new mongoose.Schema({
  username: String,
  password: String
})

//Staff Model
const Staff = mongoose.model('Staff', staffSchema)

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

//  Routes for staff
app.get("/staff_login", (req,res)=>{
  res.render("staff_login")
})

app.get("/staff_signup", (req,res)=>{
  res.render("staff_signup.ejs")
})

app.post("/staff_signup", (req,res) =>{
  bcrypt.hash(req.body.password, saltrounds, function(err,hash){
    const newStaff = new Staff({
        username: req.body.username,
        password: hash
    })

    newStaff.save((err) =>{
        if(err){
            console.log(err)
        }
        else{
            res.render("faculty_success", {username: req.body.username});
        }
    })      
});

})

app.post("/staff_login", (req,res) =>{
  let username = req.body.username;
  const password = req.body.password;
    Staff.findOne({email:username}, function(err,foundStaff){
        if(err) {
            console.log(err);
        }else{
            if(foundStaff){
                bcrypt.compare(password, foundStaff.password, (err,response)=>{
                    if(response === true){
                    res.render("faculty_success.ejs",{username: req.body.username});
                    }
                })
            }
        }
    });
})

app.get("/", (req,res) =>{
  res.render("home")
})


// Port
app.listen(process.env.PORT || 5000, ()=>{
    console.log("App Started at the ", process.env.PORT)
})