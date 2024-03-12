const mongoose = require("mongoose")
const cities = require("./cities")
const {places, descriptors} = require("./seedHelpers")
const Campground = require("../models/campground")

mongoose.connect("mongodb://localhost:27017/yelp-camp",{
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
})


const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"))
db.once("open",()=> {
    console.log("Database connected");
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB= async ()=>{
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20) +10;
        const camp = new Campground({
            author:"65e590a3a67ad0cfa151cabf",
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto dolore doloremque ea facilis hic illo neque nesciunt placeat temporibus ut? Asperiores beatae consectetur cum dolores ea ipsum odit quos repellendus?",
            price:price,
            images:[
                {
                    "url": "https://res.cloudinary.com/dbttoeufg/image/upload/v1709800694/YelpCamp/cbshmop026i9fb5dq5uu.webp",
                    "filename": "YelpCamp/cbshmop026i9fb5dq5uu"
                },
                {
                    "url": "https://res.cloudinary.com/dbttoeufg/image/upload/v1709800696/YelpCamp/slptu4pp1eul3cbbbnrc.jpg",
                    "filename": "YelpCamp/slptu4pp1eul3cbbbnrc"
                }
            ]

        })
        await camp.save()

    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});