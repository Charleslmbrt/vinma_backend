const express = require('express');
const app = express();
const mongoose = require('mongoose');

//middleware
app.use(express.json());

mongoose.connect("mongodb://localhost/vinma").then(() => {
    console.log("Connected to the DB vinma");
});

const userRoutes = require('./routes/user');
app.use(userRoutes);

app.listen(8080, () => {
    console.log("Server has started");
});