const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validatReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/reviews.js");


//Reviws
//post route
router.post("/",isLoggedIn,validatReview,wrapAsync(createReview));

//Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(destroyReview))

module.exports=router;