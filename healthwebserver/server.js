const express = require('express'),
app= express(),
bodyParser = require ('body-parser'),
mongoose = require("mongoose"),
cors = require('cors');
const Bcrypt = require("bcryptjs");
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

io.on("connection", socket => {
  console.log("Client connected");

  // Global backend variables
  var authenticated = false;

  socket.on("logIn", (data) => {
    logIn(data, socket);
  });

  socket.on("signUp", async (data) => {
    console.log("User attempted to sign up");
    var databaseUser = await User.findOne({email: data.email}).exec();
    if(!databaseUser){
      // Email available
      let tempPassword = data.password;
      data.password = Bcrypt.hashSync(data.password,10);
      await connect.then(db => {
        console.log("connected correctly to the server");
        let user = new User(data);
        user.save();
      });
      data.password = tempPassword;
      // Sign up goes here
      logIn(data, socket);
    } else {
      logInFailed(socket, "Account already exists");
    }
  });

  socket.on("getAllDoctors", async (data) => {
    let doctors = await User.find({doctor: true}).exec();
    socket.emit("getAllDoctorsResults", {doctors: doctors});
  })

  socket.on("disconnect", () => console.log("Client disconnected"))

  async function logIn(data, socket){
    console.log("User attempted to log in");
    var databaseUser = await User.findOne({email: data.email}).exec();
    if(databaseUser){
      if(Bcrypt.compareSync(data.password, databaseUser.password)){
        console.log("User successfully logged in")
        authenticated = true;
        socket.emit("logInResult", {result: true, doctor: data.doctor, message: "Success"});
      } else {
        logInFailed(socket, "Password incorrect");
      }
    } else {
      logInFailed(socket, "User does not exist");
    }
  }

  function logInFailed (socket, message){
    console.log(message);
    authenticated = false;
    socket.emit("logInResult", {result: false, doctor: false, message: message});
  }
})

server.listen(port, () => console.log(`Health App Server running at http://localhost:${port}`));
