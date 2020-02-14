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
      // Save user to the database
      await connect.then(db => {
        console.log("connected correctly to the server");
        let user = new User(data);
        user.save();
      });
      // Emit the new doctor to any pages looking at doctors
      if(data.doctor)
        emitAllDoctors();
      // Reset the password to the un encrypted version
      data.password = tempPassword;
      // Log the user into the system
      logIn(data, socket);
    } else {
      logInFailed(socket, "Account already exists");
    }
  });

  socket.on("getAllDoctors", async (data) => {
    emitAllDoctors(socket, false);
  })

  socket.on("disconnect", () => console.log("Client disconnected"))

  async function emitAllDoctors(socket, emitToAllSockets){
    let doctors = await User.find({doctor: true}, {forename: 1, _id: 1, email: 1, surname: 1}).exec();
    // Echo data back or send to every socket on the network
    if(emitToAllSockets)
      socket.emit("getAllDoctorsResults", {doctors: doctors});
    else
      socket.broadcast.emit("getAllDoctorsResults", {doctors: doctors});
  }

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
