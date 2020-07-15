const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const {API_VERSION} = require("./config");


//Load routings
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use(bodyParser.urlencoded({extend: false}));

app.use(bodyParser.json());

// Configure  Header HTTP


// Router Basic
app.use(`/api/${API_VERSION}`, authRoutes); 
app.use(`/api/${API_VERSION}`, userRoutes)

module.exports = app;