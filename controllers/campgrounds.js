const Campgrounds = require("../models/campground");

module.exports.index = async (req,res)=>{
    const campgrounds = await Campgrounds.find({});
    res.render("campgrounds/index",{campgrounds})
}

module.exports.renderNewForm = (req,res)=>{
    res.render("campgrounds/new");
}
module.exports.createCampground = async (req, res) => {
    req.flash("success","Successfully made a new campground")
    // if(!req.body.campground)throw new ExpressError("Invalid Campgrounds Data", 400)
    const campground = new Campgrounds(req.body.campground);
    campground.author = req.user._id
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async(req,res)=>{
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
}

module.exports.renderEditForm =  async (req,res)=>{
    const campground = await Campgrounds.findById(req.params.id)
    if(!campground){
        req.flash("error","Cannot find that campground!")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit",{campground})
}

module.exports.updateCampground = async (req,res) =>{
    const {id} = req.params
    const campground = await Campgrounds.findByIdAndUpdate(id,{...req.body.campground})
    req.flash("success","Successfully updated campground!")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req,res)=>{
    const {id} = req.params;
    await Campgrounds.findByIdAndDelete(id)
    req.flash("success", "Successfully deleted campground! ")
    res.redirect("/campgrounds")
}