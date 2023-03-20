const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//middleware
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_CONNECT).then(() => {
  console.log("Connected to the DB vinma");
});

const userRoutes = require("./routes/user");
app.use(userRoutes);

const postRoutes = require("./routes/post");
app.use(postRoutes);

app.listen(8080, () => {
  console.log("Server has started");
});
