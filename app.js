const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js")
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js")




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

app.get("/",(req,res)=>{
    res.send("root working");
})

app.get("/listings",wrapAsync(async(req,res,next)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.get("/listings/:id",wrapAsync(async (req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
        res.render("listings/show.ejs",{listing});
 }))

//create Route
app.post("/listings",wrapAsync(async (req,res,next)=>{
    if(!req.body.listing){
    throw new ExpressError(400,"Send valid data for listing")
    }
  
    const  newlisting=new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings")
  

})
);

app.get("/listings/:id/edit",wrapAsync(async(req,res,next)=>{
   
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})


}))
app.put("/listings/:id",wrapAsync(async (req,res,next)=>{
     if(!req.body.listing){
    throw new ExpressError(400,"Send valid data for listing")
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`);
}))

//DELETE
app.delete("/listings/:id",wrapAsync(async(req,res,next)=>{
     
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}))



// app.get("/testListing",async (req,res)=>{
//     let sampleListing =new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India",
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// })
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"page not found"));
// })
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Not found"))
// });

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Not Found"))
// })



app.use((err,req,res,next)=>{
    // console.log(err);
    let{statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).send(message);
})


app.listen(8080,()=>{
    console.log("server listening!");
})