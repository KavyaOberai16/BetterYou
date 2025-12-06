const mongoose = require("mongoose");
const Hobby = require("./hobbies");
const User = require("./user");
const Schema = mongoose.Schema;

const dailyLogsSchema = new Schema({
    text:{
        type: String,
        required: true
    },
    mood:{
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    hobby:{
        type: Schema.Types.ObjectId,
        ref: "Hobby"
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    groqOutput:{
        type: String,   
    }, //this field will be used for putting the groq ai part.
    date: {
  type: Date,
  default: Date.now,
},

},
    // automatically add two fields to every document, created at and updated at, timestamps help in doing
    {timestamps: true}); 

const dailyLogs = mongoose.model("dailyLogs", dailyLogsSchema);

module.exports = dailyLogs;