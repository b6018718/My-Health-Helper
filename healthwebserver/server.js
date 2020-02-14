const express = require('express'),
app= express(),
bodyParser = require ('body-parser'),
mongoose = require("mongoose"),
cors = require('cors');
blogRoutes = express.Router();

const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 5000;

const User = require("./models/user");
const connect  = require("./dbconnection");

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.set("port", port);

/*try{
  mongoose.connect(
    "mongodb://localhost:27017/healthappdb",
    { useNewUrlParser: true }
  );
  mongoose.set("useCreateIndex", true);
  mongoose.set('useFindAndModify', false);
} catch (e){
  console.log("Connection failed");
}
const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});*/


//app.listen(app.get("port"), () => {
  //console.log(`MyBlog Express Server running at http://localhost:${app.get("port")}`)
//});

io.on("connection", socket => {
  console.log("Client connected");

  // Global backend variables
  var authenticated = false;

  socket.on("logIn", (data) => {
    logIn(data, socket);
  });

  socket.on("signUp", (data) => {
    console.log("User attempted to sign up");
    console.log(data.forename);
    console.log(data.surname);
    console.log(data.email);
    console.log(data.password);

    connect.then(db => {
      console.log("connected correctly to the server");
      let user = new User(data);
      user.save();
    });

    // Sign up goes here
    logIn(data, socket);
  });

  socket.on("disconnect", () => console.log("Client disconnected"))

  function logIn(data, socket){
    console.log("User attempted to log in");

      if(data.email == 'anthonydranfield@hotmail.co.uk' && data.password == 'Password1'){
        console.log("User successfully logged in")
        authenticated = true;
        socket.emit("logInResult", {result: true, doctor: true});
  
      } else {
        console.log("User failed to log in");
        authenticated = false;
        socket.emit("logInResult", {result: false, doctor: false});
      }
  }
})



server.listen(port, () => console.log(`Health App Server running at http://localhost:${port}`));
