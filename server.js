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

const defaultPort = 8080;
const PORT = process.env.PORT;

app.listen(PORT || defaultPort, () => {
  console.log(`Server has started on port ${PORT || defaultPort}.`);
});
