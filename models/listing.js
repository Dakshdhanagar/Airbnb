const mongoose=require("mongoose");
const Schema=mongoose.Schema;


const listingSchema=new Schema({
    title:{
       type: String,
       require:true,
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
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;