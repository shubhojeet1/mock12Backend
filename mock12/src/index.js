require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connect = require("./config/db");
const app = express();
const User = require("./features/user/user.route");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", User);

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("This is Home Route of Mock-Revision Backend");
});

app.listen(PORT, async () => {
  await connect();
});

