const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const Joi = require('joi');
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const session=require("express-session");
const flash=require("connect-flash");


const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";
main().then(()=>{
    console.log("connection successful")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    //for security purpose httpOnly true
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

app.get("/",(req,res)=>{
    res.send("root working");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    //success id array
    res.locals.success=req.flash("success");
   res.locals.error = req.flash("error");
    next();
})



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.use((err,req,res,next)=>{
    // console.log(err);
    let{statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
});


app.listen(8080,()=>{
    console.log("server listening!");
});