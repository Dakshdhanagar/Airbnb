const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { route } = require("./listing.js");
const {saveRedirectUrl}=require("../middleware.js");
const { signup, renderSignup, renderLoginForm,  loginF, logout } = require("../controllers/users.js");

router.route("/signup")
.get(renderSignup)
.post(signup);


router.route("/login")
.get(renderLoginForm)
.post(saveRedirectUrl,passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),loginF)


router.get("/logout",logout)


module.exports=router;