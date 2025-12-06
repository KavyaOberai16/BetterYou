const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hobbySchema = new Schema({
    image: {
        url: String,
        filename: String
    },
    hobby: {
        type: String,
        enum: [
            "Photography", "Artwork", "Culinary Arts", "Gardening", "Reading",
            "Music","Fitness", "Yoga", "Culinary Baking", "Dance", "Programming",
            "Gaming", "Writing", "Blogging", "Powerlifting","Vocal Artistry","Piano", "Guitar"
        ],
        required: true
    }, 
    description: {
        type: String,
        required: true,
        maxLength: 100
    },
}, 
{ timestamps: true }); // <-- timestamps enabled

const Hobby = mongoose.model("Hobby", hobbySchema);

module.exports = Hobby;
