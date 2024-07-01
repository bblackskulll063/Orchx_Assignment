const mongoose = require("mongoose");
// require('dotenv').config()
// const url = process.env.MONGO_ATLAS_URL;
const url =
  "mongodb+srv://natours_user_yudi:test123@cluster0.rpgyo.mongodb.net/inventoryDB?retryWrites=true&w=majority";

const connectToMongo = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = connectToMongo;
