require("dotenv").config({ path: "../.env" }); // load environment variables from .env

const mongoose = require("mongoose");
const initData = require("./data.js"); 
const Hobby = require("../models/hobbies.js"); 

// Use the MONGO_URL from env; fallback to local DB if not set
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/LoopedIn";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("connected to DB");
  console.log("Connected DB name:", mongoose.connection.name); // log DB name
  console.log("Connected host:", mongoose.connection.host);     // log DB host
}

const initDb = async () => {
  await Hobby.deleteMany({}); // pehle if any data added in db, delete it
  await Hobby.insertMany(initData.data); // add new data in the db
  console.log("data was initialized");
};

main().then(initDb).catch(err => {
  console.error("Error has occurred:", err);
});
