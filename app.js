if (process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const ejsMate = require("ejs-mate")
const express = require("express")
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const path = require("path")
const ExpressError = require("./utils/ExpressError")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user")

const userRoutes = require("./routes/users")
const campgroundRoutes = require("./routes/campgrounds")
const reviewRoutes = require("./routes/reviews")

const app = express()

app.set("view engine", "ejs")
app.set("views",path.join(__dirname,"views"))
app.engine('ejs',ejsMate)
app.use(express.urlencoded({ extended: true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname,"public")))

const sessionConfig = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expire: Date.now() + 1000 * 60 *60 * 24 *7,
        maxAge :1000 * 60 *60 * 24 *7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next();
})

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

app.use("/",userRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/reviews",reviewRoutes)

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