const Listing=require("../models/listing.js");


module.exports.index=async(req,res,next)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderForm=(req,res)=>{
    
    res.render("listings/new.ejs");
    
}

module.exports.showListings=async (req,res,next)=>{
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
    // console.log(listing);
        res.render("listings/show.ejs",{listing});
 }

 module.exports.createListings=async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
     const  newlisting=new Listing(req.body.listing);
     newlisting.owner=req.user._id;
     newlisting.image={url,filename};
     await newlisting.save();
     req.flash("success","New Listings Created!");
     res.redirect("/listings")
}

module.exports.editForm=async(req,res,next)=>{
    
     let {id}=req.params;
     const listing=await Listing.findById(id);
     if(!listing){
         req.flash("error","Listing you requested for does not exist!");
         return res.redirect("/login");
    }
    let orignalImageUrl=listing.image.url;
       orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/h_250,w_250");
     res.render("listings/edit.ejs",{listing,orignalImageUrl})
 
 
 }

 module.exports.updateListing=async (req,res,next)=>{
    
    let {id}=req.params;
    let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=undefined){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    
   
    req.flash("success","Listings UpDate");
    res.redirect(`/listings/${id}`);
  }


  module.exports.destroyListing=async(req,res,next)=>{
      
     let {id}=req.params;
     let deleteListing=await Listing.findByIdAndDelete(id);
     console.log(deleteListing);
     req.flash("success"," Listings Deleted!");
     res.redirect("/listings");
 }