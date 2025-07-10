const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { route } = require("./listing.js");
const {saveRedirectUrl}=require("../middleware.js")

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})
router.post("/signup",async(req,res,next)=>{
    try{ let {username,email,password}=req.body;
    const newUser=new User({email,username});
    let reg=await User.register( newUser,password);
    console.log(reg);
    //for automatic login
    req.login(reg,(err)=>{
        if(err){
            return next(err);
        }
         req.flash("success","welcome to Wanderlust");
        res.redirect("/listings");
    })
   
    }catch(err){
    req.flash("error",err.message);
    res.redirect("/signup");
}
});

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
router.post("/login",
    saveRedirectUrl,
    passport.authenticate('local',{failureRedirect:'/login',failureFlash:true})
    ,async(req,res)=>{
        // console.log(req.user);
        req.flash("success","weelcome to Wanderlust");
        let redirectUrl=res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl);
})
router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
             return next(err);
        }
       req.flash("success","you are logged out!");
    res.redirect("/listings");
    })
    
})


module.exports=router;