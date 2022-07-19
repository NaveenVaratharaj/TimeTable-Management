// Including Dotenv
if(process.env.Node !== 'production'){
    require("dotenv").config()
}

// Required Dependencies
const express = require("express")
const app = express();
const mongoose = require("mongoose")
const indexRouter = require("./routes/index")
const studentlog = require("./routes/studentlog")
const studentsignup = require("./routes/studentsignup")

// Middleware
app.set("view engine", "ejs")
app.use(express.static('public'))
app.use("/", indexRouter)
app.use("/", studentlog)
app.use("/", studentsignup)


// Db connection
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true} , () =>{
    console.log("Database Connected!")
})


// Port
app.listen(process.env.PORT || 4000, ()=>{
    console.log("App Started at the ", process.env.PORT)
})