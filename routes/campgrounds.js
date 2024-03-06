const express  = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const {isLoggedIn, isAuthor, validateCampground} = require("../middleware")
const campground = require("../controllers/campgrounds")

router.route("/")
    .get( catchAsync(campground.index))
    .post(isLoggedIn, validateCampground,catchAsync(campground.createCampground))

router.get("/new",isLoggedIn, campground.renderNewForm)

router.route("/:id")
    .get(catchAsync(campground.showCampground))
    .put(isLoggedIn,isAuthor, validateCampground,catchAsync(campground.updateCampground))
    .delete(isLoggedIn,isAuthor, catchAsync(campground.deleteCampground))

router.get("/:id/edit",isLoggedIn, isAuthor, catchAsync(campground.renderEditForm))

module.exports = router