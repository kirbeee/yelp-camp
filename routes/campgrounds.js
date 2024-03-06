const express  = require("express");
const catchAsync = require("../utils/catchAsync");
const Campgrounds = require("../models/campground");
const router = express.Router();
const {isLoggedIn, isAuthor, validateCampground} = require("../middleware")


router.get("/", catchAsync(async (req,res)=>{
    const campgrounds = await Campgrounds.find({});
    res.render("campgrounds/index",{campgrounds})
}))
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("campgrounds/new");
})
router.post('/',isLoggedIn, validateCampground,catchAsync(async (req, res) => {
    req.flash("success","Successfully made a new campground")
    // if(!req.body.campground)throw new ExpressError("Invalid Campgrounds Data", 400)
    const campground = new Campgrounds(req.body.campground);
    campground.author = req.user._id
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))
router.get("/:id", catchAsync(async(req,res)=>{
    const campground = await Campgrounds.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:"author"
        }
    }).populate("author")
    if(!campground){
        req.flash("error","Cannot find that campground!")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show.ejs",{campground})
}))
router.get("/:id/edit",isLoggedIn, isAuthor, catchAsync(async (req,res)=>{
    const campground = await Campgrounds.findById(req.params.id)
    if(!campground){
        req.flash("error","Cannot find that campground!")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit",{campground})
}))
router.put("/:id",isLoggedIn,isAuthor, validateCampground,catchAsync(async (req,res) =>{
    const {id} = req.params
    const campground = await Campgrounds.findByIdAndUpdate(id,{...req.body.campground})
    req.flash("success","Successfully updated campground!")
    res.redirect(`/campgrounds/${campground._id}`)
}))
router.delete("/:id",isLoggedIn,isAuthor, catchAsync(async (req,res)=>{
    const {id} = req.params;
    await Campgrounds.findByIdAndDelete(id)
    req.flash("success", "Successfully deleted campground! ")
    res.redirect("/campgrounds")
}))


module.exports = router