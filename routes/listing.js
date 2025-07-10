const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js")

const {isLoggedIn,isOwner,validatListing}=require("../middleware.js");






//index route
router.get("/",wrapAsync(async(req,res,next)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))

//new route
router.get("/new",isLoggedIn,(req,res)=>{
    
    res.render("listings/new.ejs");
    
})
//show route
router.get("/:id",wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path:"reviews",populate:{
        path:"author",
    }})
    .populate("owner");
    if(!listing){
         req.flash("error","Listing you requested not exist!");
         return res.redirect("/login");
    }
    console.log(listing);
        res.render("listings/show.ejs",{listing});
 }))



 //create Route
 router.post("/",isLoggedIn,
     validatListing,
     wrapAsync(async (req,res,next)=>{
     const  newlisting=new Listing(req.body.listing);
     newlisting.owner=req.user._id;
     await newlisting.save();
     req.flash("success","New Listings Created!");
     res.redirect("/listings")
   
 
 })
 );
 //edit
 router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res,next)=>{
    
     let {id}=req.params;
     const listing=await Listing.findById(id);
      
     res.render("listings/edit.ejs",{listing})
 
 
 }))
 //update
 router.put("/:id",
    isLoggedIn,
    isOwner,
     validatListing,
     wrapAsync(async (req,res,next)=>{
 
     let {id}=req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listings UpDate");
     res.redirect(`/listings/${id}`);
 }))
 
 //DELETE
 router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res,next)=>{
      
     let {id}=req.params;
     let deleteListing=await Listing.findByIdAndDelete(id);
     console.log(deleteListing);
     req.flash("success"," Listings Deleted!");
     res.redirect("/listings");
 }));


 module.exports=router;

