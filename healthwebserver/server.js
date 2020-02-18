const express = require('express'),
app= express(),
bodyParser = require ('body-parser'),
mongoose = require("mongoose"),
cors = require('cors');
const Bcrypt = require("bcryptjs");

const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 5000;

const User = require("./models/user");
const connect  = require("./dbconnection");

// Sanitize data
var sanitize = require('mongo-sanitize');

//app.use(cors());

app.use(express.json());
app.use(bodyParser.json());
app.set("port", port);

io.on("connection", socket => {
  console.log("Client connected");

  // Global backend variables
  var authenticated = false;
  var userId = null;

  socket.on("logIn", (data) => {
    logIn(data, socket);
  });

  socket.on("signUp", async (data) => {
    // Sanitize data
    data = deepSanitize(data);
    if(!data.email || !data.password || !data.forename || !data.surname){
      logInFailed(socket, "Fields are empty", data);
      return;
    }

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
        emitAllDoctors(socket, true);
      // Reset the password to the un encrypted version
      data.password = tempPassword;
      // Log the user into the system
      logIn(data, socket);
    } else {
      logInFailed(socket, "Account already exists", data);
    }
  });

  socket.on("getAllDoctors", async (data) => {
    emitAllDoctors(socket, false);
  });

  socket.on("updateAssignedDoctor", async function (data){
    //Update user
    data = sanitize(data);
    await User.findOneAndUpdate({_id: userId}, {idAssignedDoctor: data});
    socket.emit("updateAssignedDoctorResult", "Success!");
  });

  socket.on("getMyDoctor", async function (data){
    console.log("Attempting to get patients doctor")
    if(authenticated){
      var databaseUser = await User.findOne({_id: userId}).exec();
      console.log(databaseUser);
      if(databaseUser.idAssignedDoctor != null){
        let doctors = await User.find({doctor: true}, {forename: 1, _id: 1, email: 1, surname: 1}).sort({ forename: 1}).exec();
        socket.emit("getMyDoctorResults", {doctors: doctors, idAssignedDoctor: databaseUser.idAssignedDoctor });
      } else {
        emitAllDoctors(socket, false);
      }
    }
  });

  socket.on("disconnect", () => console.log("Client disconnected"))

  async function emitAllDoctors(socket, emitToAllSockets){
    if(authenticated){
      let doctors = await User.find({doctor: true}, {forename: 1, _id: 1, email: 1, surname: 1}).sort({ forename: 1}).exec();
      // Echo data back or send to every socket on the network
      if(!emitToAllSockets){
        socket.emit("getAllDoctorsResults", {doctors: doctors});
      } else {
        socket.broadcast.emit("getAllDoctorsResults", {doctors: doctors});
      }
    }
  }

  async function logIn(data, socket){
    console.log("User attempted to log in");
    //Sanitise data
    data = deepSanitize(data);
    // Check email exists
    if(!data.email || !data.password){
      logInFailed(socket, "Fields are empty", data);
      return;
    }

    // Check if account already exists
    var databaseUser = await User.findOne({email: data.email}).exec();
    if(databaseUser){
      if(Bcrypt.compareSync(data.password, databaseUser.password)){
        console.log("User successfully logged in")
        authenticated = true;
        userId = databaseUser._id;
        socket.emit("logInResult", {result: true, doctor: data.doctor, forename: databaseUser.forename, surname: databaseUser.surname, message: "Success"});
      } else {
        logInFailed(socket, "Password incorrect", data);
      }
    } else {
      logInFailed(socket, "User does not exist", data);
    }
  }

  function logInFailed (socket, message, data){
    console.log(data);
    console.log(message);
    authenticated = false;
    socket.emit("logInResult", {result: false, doctor: false, message: message});
  }

  const deepSanitize = (value) => {
    if(Array.isArray(value)){
        value.forEach(elm=>deepSanitize(elm))
    }
    if(typeof(value) === 'object' && value !== null){
        Object.values(value).forEach((elm)=>{
            deepSanitize(elm)
        })
    }
    return sanitize(value)
}
})

server.listen(port, () => console.log(`Health App Server running at http://localhost:${port}`));
