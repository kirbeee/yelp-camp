const ejsMate = require("ejs-mate")
const express = require("express")
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const path = require("path")
const ExpressError = require("./utils/ExpressError")

const campgrounds = require("./routes/campgrounds")
const review = require("./routes/reviews")

const app = express()

app.set("view engine", "ejs")
app.set("views",path.join(__dirname,"views"))
app.engine('ejs',ejsMate)

app.use(express.urlencoded({ extended: true}))
app.use(methodOverride("_method"))

mongoose.connect("mongodb://localhost:27017/yelp-camp",{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error"))
db.once("open",()=>{
    console.log("Database connection")
})

app.use("/campgrounds", campgrounds)
app.use("/campgrounds/:id/reviews",review)

app.get('/',(req,res)=>{
    res.render("home")
})
app.all("*",(req, res, next)=>{
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next)=>{
    const {statusCode=500, message="Something went wrong"} = err
    res.status(statusCode).render('error',{err});
})
app.listen(4000, ()=>{
    console.log("serving on port 4000")
})