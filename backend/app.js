const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const scheduleRoutes = require("./routes/schedule");

const app = express();

mongoose
  .connect(
    "mongodb+srv://admin:" + process.env.MONGO_ATLAS_PW + "@cluster0.zchzj.mongodb.net/node-angular?retryWrites=true&w=majority"
    //"mongodb+srv://admin:" + process.env.MONGO_ATLAS_PW+  "@cluster0.zchzj.mongodb.net/node-angular?retryWrites=true&w=majority"
    //"mongodb+srv://admin:21jhz5eWLufdeIYu@cluster0.zchzj.mongodb.net/node-angular"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});


app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/schedule", scheduleRoutes);

module.exports = app;
