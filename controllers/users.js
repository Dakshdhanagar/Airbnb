const User=require("../models/user.js");


module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res,next)=>{
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
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginF=async(req,res)=>{
        // console.log(req.user);
        req.flash("success","weelcome to Wanderlust");
        let redirectUrl=res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
             return next(err);
        }
       req.flash("success","you are logged out!");
    res.redirect("/listings");
    })
    
}