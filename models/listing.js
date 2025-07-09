const mongoose=require("mongoose");
const review = require("./review");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const { required } = require("joi");


const listingSchema=new Schema({
    title:{
       type: String,
       required:true,
    },
    description:String,
    image: {
        type:String,
        default:
            "https://www.travelbelize.org/email-segmentation/default",
        set:(v)=>v===""?"https://www.travelbelize.org/email-segmentation/default":v ,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
       {
         type:Schema.Types.ObjectId,
         ref:"Review"
       },
    ],
});

//creating post mongoose middleware
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
            await Review.deleteMany({_id: {$in: listing.reviews}})
    }

});



const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;