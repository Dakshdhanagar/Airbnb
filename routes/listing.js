const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js")
const multer=require("multer");
const {storage}=require("../cloudConfig.js")
const upload =multer({storage})


const {isLoggedIn,isOwner,validatListing}=require("../middleware.js");
const { index, renderForm, showListings, createListings, editForm, updateListing, destroyListing } = require("../controllers/listing.js");

router
.route("/")
.get(wrapAsync(index))//index route
.post(isLoggedIn,validatListing,upload.single('listing[image]'), wrapAsync(createListings))//create Route


//new route
router.get("/new",isLoggedIn,renderForm)

router
.route("/:id")
.get(wrapAsync(showListings))//show route
.put(isLoggedIn,isOwner,upload.single('listing[image]'), validatListing,wrapAsync(updateListing))//update
.delete(isLoggedIn,isOwner,wrapAsync(destroyListing))//DELETE


//edit
 router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(editForm))

 module.exports=router;

