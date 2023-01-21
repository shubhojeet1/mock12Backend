require("dotenv").config();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8080;

function connect() {
  mongoose.set("strictQuery", false);
  return mongoose.connect(process.env.DB_URL, () => {
    console.log(`running port on http://localhost:${PORT}`);
    console.log("Connected to MongoDB");
  });
}

module.exports = connect;
