const express = require("express")
const router = express.Router()

router.get("/student_login", (req,res) =>{
    res.render("student_login.ejs")
})

module.exports = router