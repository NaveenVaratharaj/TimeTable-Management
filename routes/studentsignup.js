const express = require("express")
const router = express.Router()

router.get("/student_signup", (req,res) =>{
    res.render("student_signup.ejs")
})

module.exports = router