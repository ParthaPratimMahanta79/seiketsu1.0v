console.log("🔥 db.js file loaded");

const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("🔥 connectDB function called");
  await mongoose.connect(process.env.MONGO_URI);
};


module.exports = connectDB;