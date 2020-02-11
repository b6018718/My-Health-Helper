const express = require('express'),
app= express(),
bodyParser = require ('body-parser'),
mongoose = require("mongoose"),
cors = require('cors');
blogRoutes = express.Router();

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.set("port", process.env.PORT || 5000);

mongoose.connect(
  "mongodb://localhost:27017/healthappdb",
  { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true);
mongoose.set('useFindAndModify', false);

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.listen(app.get("port"), () => {
  console.log(`MyBlog Express Server running at http://localhost:${app.get("port")}`)});