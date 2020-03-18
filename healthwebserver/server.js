const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require("mongoose"),
  cors = require('cors');
const Bcrypt = require("bcryptjs");

const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 5000;

const User = require("./models/user");
const PatientModule = require("./models/patinetmodule")
const connect = require("./dbconnection");

// Sanitize data
var sanitize = require('mongo-sanitize');

app.use(express.json());
app.use(bodyParser.json());
app.set("port", port);

var allSockets = [];
var fingerPrickSubscribers = [];
var userUpdateSubscribers = [];

/*
 Socket IO is used for connecting to the front end.
 It requires the user to communicate in a two-way
 method that allows real time communication.
*/


//Initialise patient module collection/documents if it does not exist
connect.then( function (db) {
createBasePatientModueles()
});
async function createBasePatientModueles()
{
  mongoose.connection.db.listCollections().toArray(async function(err,names){ //get list of all mongo db collections
    if(err)
      { console.log(err)}
    else
    {
      var patientModulesNotCreated = true
      for (i= 0; i< names.length && patientModulesNotCreated;i++)
      {
        if(names[i].name == "patientmodules") //check if patientmodule collection exists
        {
          var documentCount = await PatientModule.countDocuments({}).exec()
          //console.log(documentCount)
          if(documentCount != 0) //check if collection is pop
          {
          patientModulesNotCreated = false;
          }
        }
        
      }
     // console.log(patientModulesNotCreated)
      if (patientModulesNotCreated) //if patient module is not created, populate collection with details for exercise, diet and blood sugar modules
      {
        var pModule = new PatientModule(
          {moduleID:1,navBarName:"Record Diet",homePageName:"Record Diet",
          urlLink:"/Patient/Food-Intake",
          moduleName:"Diet", homePageFunctionCall: null,
          homePageNameAlt: null,homePageFunctionCallAlt: null,
          altCondition: null});
        pModule.save();
        pModule = new PatientModule(
          {moduleID:2,navBarName:"Record Exercise",homePageName:"Record Exercise",
          urlLink:"/Patient/Exercise",
          moduleName:"Exercise", homePageFunctionCall: null,
          homePageNameAlt: null,homePageFunctionCallAlt: null,
          altCondition: null});
        pModule.save();
        pModule = new PatientModule(
          {moduleID:3,navBarName:null,homePageName:"Register Finger Prick Device",
          urlLink:null,moduleName:"Blood sugar", 
          homePageFunctionCall: "handleShow",
          homePageNameAlt: "Deactivate Finger Prick Device",homePageFunctionCallAlt: "clickRegisterDevice",
          altCondition: "!fingerPrickActivated"});
        pModule.save();
      }
    }
    }
    )
}



io.on("connection", socket => {
  //console.log("Client connected");
  // Global backend variables
  var authenticated = false;
  var userId = null;

  socket.on("logIn", (data) => {
    logIn(data, socket);
  });

  socket.on("signUp", async (data) => {
    // Sanitize data
    data = deepSanitize(data);
    if (!data.email || !data.password || !data.forename || !data.surname) {
      // Send error message if fields are not filled in
      logInFailed(socket, "Fields are empty", data);
      return;
    }

    //console.log("User attempted to sign up");
    var databaseUser = await User.findOne({ email: data.email }).exec();
    if (!databaseUser) {
      // Email available and not already in use
      //console.log(data)
      let tempPassword = data.password;
      data.password = Bcrypt.hashSync(data.password, 10);
      // Save user to the database
      await connect.then(async function (db) {
        let user = new User(data);
        //console.log(user)
        await user.save();
      });
      // Emit the new doctor to any pages looking at doctors
      if (data.doctor)
        emitAllDoctors(socket, true);
      // Reset the password to the un encrypted version
      data.password = tempPassword;
      // Log the user into the system
      logIn(data, socket);
    } else {
      logInFailed(socket, "Account already exists", data);
    }
  });

  socket.on("deleteAccount", async (data) => {
    // First check if user is authenticated
    if (authenticated) {
      // Delete the user using mongoose
      await User.deleteOne({ _id: userId });
      // Emit the success message
      socket.emit("deleteAccountResults", "Success");
      // Reset authenication for the socket
      authenticated = false;
      userId = "";
    }
  });

  socket.on("getAllDoctors", async (data) => {
    emitAllDoctors(socket, false);
  });

  socket.on("updateAssignedDoctor", async function (data) {
    // Sanitize data from the client
    data = sanitize(data);
    // Update users doctor
    await User.findOneAndUpdate({ _id: userId }, { idAssignedDoctor: data });
    // Emit success message to the client
    socket.emit("updateAssignedDoctorResult", "Success!");
  });

  socket.on("getMyDoctor", async function (data) {
    //console.log("Attempting to get patients doctor")
    if (authenticated) {
      // Grab user data from the database with mongoose
      var databaseUser = await User.findOne({ _id: userId }).exec();
      // Check if the patient has a doctor
      if (databaseUser.idAssignedDoctor != null) {
        // If user has a doctor, get the full list of doctors
        let doctors = await User.find({ doctor: true }, { forename: 1, _id: 1, email: 1, surname: 1 }).sort({ forename: 1 }).exec();
        // Then send the list plus the id of the users selected doctor
        socket.emit("getMyDoctorResults", { doctors: doctors, idAssignedDoctor: databaseUser.idAssignedDoctor });
      } else {
        // Send a list of all doctors to the client
        emitAllDoctors(socket, false);
      }
    }
  });

  // When the socket times out, or the client closes the connection
  socket.on("disconnect", () => {
    // Remove the socket from the array of listeners of patient data
    unsubPatientRecord(socket);
    // Remove the socket from the array of sockets
    allSockets = allSockets.filter(socket => socket.id != userId);
  })

  // Add the user to the array of users to have their blood sugar updated
  socket.on("subscribeToFingerPrick", async function (data) {
    let approvedModuleList = await User.findOne({ _id: userId} ,{_id: 0, enabledModules:1}).exec()
    //check blood sugard module is approved, only allow subscribing if it is approved
    if(checkIfApproved(3,approvedModuleList))
    {
    fingerPrickSubscribers.push(userId);
    }
  });

  // Remove the user to the array of users to have their blood sugar updated
  socket.on("unSubscribeFingerPrick", async function (data) {
    fingerPrickSubscribers = fingerPrickSubscribers.filter(id => userId.toString().localeCompare(id.toString()) != 0)
  });

  // Check if the user is subscribed to blood sugar updates
  socket.on("checkIfSubscribed", async function (data) {
    var subscribed = false;
    // Attempt to get the user from the array with the find function
    var user = fingerPrickSubscribers.find(sub => userId.toString().localeCompare(sub.toString()) == 0);
    // Emit the results
    if (user) {
      socket.emit("checkIfSubscribedResults", { result: true });
    } else {
      //if(!subscribed){
      socket.emit("checkIfSubscribedResults", { result: false });
    }
  });

  // Get all the users with a doctor value of true
  async function emitAllDoctors(socket, emitToAllSockets) {
    if (authenticated) {
      let doctors = await User.find({ doctor: true }, { forename: 1, _id: 1, email: 1, surname: 1 }).sort({ forename: 1 }).exec();
      // Echo data back or send to every socket on the network
      if (!emitToAllSockets) {
        socket.emit("getAllDoctorsResults", { doctors: doctors });
      } else {
        socket.broadcast.emit("getAllDoctorsResults", { doctors: doctors });
      }
    }
  }

  // Get all the patients for a doctor
  socket.on("getMyPatients", async (data) => {
    emitMyPatients(socket);
  });

  async function emitMyPatients(socket) {
    if (authenticated) {
      // Get all the patients that have the doctors user id as their doctor
      let myPatients = await User.find({ idAssignedDoctor: userId }, { forename: 1, _id: 1, email: 1, surname: 1 }).sort({ forename: 1 }).exec();
      // Emit the entire array to the socket
      socket.emit("getMyPatientsResults", { myPatients: myPatients });
    }
  }

    // Get all the patients and their modules for a doctor
    socket.on("getMyPatientsModules", async (data) => {
      emitMyPatientsModules(socket);
    });
  
    async function emitMyPatientsModules(socket) {
      if (authenticated) {
        // Get all the patients and their modules that have the doctors user id as their doctor
        let myPatients = await User.find({ idAssignedDoctor: userId }, { forename: 1, _id: 1, email: 1, surname: 1,enabledModules: 1}).sort({ forename: 1 }).exec();
        //get list of all modules
        allModules = await PatientModule.find({},{moduleID:1,moduleName:1}).sort({moduleID:  1}).lean().exec()
        //add enabledmodules = false property to allmodules, used as default if module has not be assigned to patient before
        allModules = allModules.map( module => {module.enabled = false; return module}) 
        //console.log(allModules)
        //goes through enabled moduled list for all patients, if a module from all list is not in their list, adds the module to to their list
        for (let myPatient of myPatients)
        {
          for(let module of allModules)
          {
            let findModule = myPatient.enabledModules.find( pMod => pMod.moduleID == module.moduleID)
            if(findModule == null)
            {
              myPatient.enabledModules.push(module)
            }
          }

          //console.log(myPatient.enabledModules)
          //compare modules based on moduleID, used to sort enabled modules after adding in non existant modules
          myPatient.enabledModules.sort((a,b) => (a.moduleID > b.moduleID)? 1:-1)
          //console.log(myPatient) 
        }
        // Emit the entire array to the socket
        socket.emit("getMyPatientsModulesResults", { myPatients: myPatients });
      }
    }
    //list for toggle patient module request
    socket.on("togglePatientModule", async (data)=>{
      if (authenticated) { //check user is logged in
      togglePatientModule(data)
      }
    });
    async function togglePatientModule(data)
    {
      data = deepSanitize(data)//sanitize data before inputting it into the server
      let user = await User.findOne({_id: data.toggledModule.patientID},{_id: 1, enabledModules: 1}).exec()
      if (user.enabledModules.length == 0)//if no values are in the array, just push current value into the array
      {
        user.enabledModules.push(data.toggledModule.moduleData)
      }
      else
      {
        //check if module we are toggling exists in the array
        existingIndex = user.enabledModules.findIndex(module => module.moduleID == data.toggledModule.moduleData.moduleID)
        {
          if (existingIndex == -1) //if module doesn't exist in the list, push it to the list
          {
            user.enabledModules.push(data.toggledModule.moduleData)
            user.enabledModules.sort((a,b) => (a.moduleID > b.moduleID)? 1:-1) //sort array so values are in order after adding new item
          }
          else //replace value at existing index
          {
            user.enabledModules[existingIndex] = data.toggledModule.moduleData
          }
        }
      }
      await user.save()
      //console.log(user)
    }



  // Add an item of food for the user
  socket.on("recordFoodDiary", async (data) => {
    if (authenticated) {
      // Filter out data that could lead to no-SQL injection
      data = deepSanitize(data)
      let approvedModuleList = await User.findOne({ _id: userId} ,{_id: 0, enabledModules:1}).exec()
      //check food module is approved, only allow data entry if it is approved
      if(checkIfApproved(1,approvedModuleList))
      {
        //console.log("food data entry approved")
        // Get the user
        var user = await User.findOne({ _id: userId }).exec();
        // Push each item in the list from the user into the users food record
        for (let foodRecord of data) {
          user.foodRecord.push({ foodname: foodRecord.name, calories: foodRecord.calories, foodgroup: foodRecord.group });
        }
        // Save the new data into the database
        await user.save();

        // Real time updates
        for (let sub of userUpdateSubscribers) {
          // Check if there are any users watching the patient record
          if (stringEquals(user._id, sub.userId)) {
            // Send the new data to the client watching the patient record
            sub.socket.emit("realTimeFood", { foodRecord: user.foodRecord });
          }
        }
      }
    }
  })

  // Record exercise data for a patient
  socket.on("recordExerciseDiary", async (data) => {
    if (authenticated) {
      // Filter the data to prevent no-SQL injection
      data = deepSanitize(data)
      let approvedModuleList = await User.findOne({ _id: userId} ,{_id: 0, enabledModules:1}).exec()
      //check if exercise module is approved, only allow data entry if it is approved
      if(checkIfApproved(2,approvedModuleList))
      {
        //console.log("exercise data entry approved")
        var user = await User.findOne({ _id: userId }).exec();
        // Push the new data into the users exercise record
        for (let exerciseRecord of data) {
          user.exercise.push({ exercisename: exerciseRecord.exercisename, exercisetype: exerciseRecord.exercisetype, exercisedurationmins: exerciseRecord.exercisedurationmins });
        }
        await user.save();

        // Real time updates
        for (let sub of userUpdateSubscribers) {
          // Check if there are any users watching the patient record
          if (stringEquals(user._id, sub.userId)) {
            // Send the new data to the client watching the patient record
            sub.socket.emit("realTimeExercise", { exercise: user.exercise });
          }
        }
      }
    }
  });

  // User is watching now watching the patient record page
  socket.on("getMyPatientRecord", async (data) => {
    if (authenticated) {
      // Check if the user watching is a doctor or a patient
      let isDoctor = await User.findOne({ _id: userId }, { _id: 1, doctor: 1 }).exec();
      if (isDoctor.doctor) {
        // Send the most up to date patient record
        emitMyPatientRecord(socket, data.selectedPatientID);
        // Add the doctor to the array of users watching the patient record for the patient
        subscribeToUserUpdate(socket, data.selectedPatientID);
      } else {
        // Send the most up to date patient record
        emitMyPatientRecord(socket, userId);
        // Add patient to the array of users watching the patient record
        subscribeToUserUpdate(socket, userId);
      }
    }
  })

  // Remove user from watching the patient record of a patient
  socket.on("unsubPatientRecord", async () => {
    unsubPatientRecord(socket);
  });

  // Filter socket out of the array of watchers
  async function unsubPatientRecord(socket) {
    userUpdateSubscribers = userUpdateSubscribers.filter(function (sub) { return (sub.socket != socket) });
  }

  // Gather all the patient data and send it, don't send things like passwords
  // (Even though they are encrypted)
  async function emitMyPatientRecord(socket, selectedPatientID) {
    //console.log(selectedPatientID)
    let patientDetails = await User.findOne({ _id: selectedPatientID }, { _id: 1, forename: 1, surname: 1, email: 1, sex: 1, DoB: 1, mobile: 1, telephone: 1, address: 1, NHSnumber: 1 }).exec();
    let registeredDoctorID = await User.findOne({ _id: selectedPatientID }, { _id: 1, idAssignedDoctor: 1 }).exec();
    let registeredDoctor = await User.findOne({ _id: registeredDoctorID.idAssignedDoctor }, { _id: 1, forename: 1, surname: 1, email: 1 }).exec()
   
     // get list of all aproved modules
    let approvedModuleList = await User.findOne({ _id: selectedPatientID} ,{_id: 0, enabledModules:1}).exec()
    //for each module, check if it approved
    let isApprovedDiet = checkIfApproved(1,approvedModuleList)
    let isApprovedExercise = checkIfApproved(2,approvedModuleList)
    let isApprovedBloodSugar = checkIfApproved(3,approvedModuleList)
   //if module is approved, return results for module, otherwise return null
    let bloodSugarReadings = isApprovedBloodSugar? await User.findOne({ _id: selectedPatientID }, { _id: 0, fingerPrick: 1 }).exec():null;
    let exercise =isApprovedExercise?await User.findOne({ _id: selectedPatientID }, { _id: 0, exercise: 1 }).exec():null;
    let foodDiary = isApprovedDiet?await User.findOne({ _id: selectedPatientID }, { _id: 0, foodRecord: 1 }).exec():null;
    socket.emit("getMyPatientRecordResults", { registeredDoctor: registeredDoctor, patientDetails: patientDetails, bloodSugarReadings: bloodSugarReadings, exercise: exercise, foodDiary: foodDiary });
  }
  //checks if module exists in patient module list, and then checks if it is currently set to be enabled/approved by the patient's doctor
  function checkIfApproved(moduleIDCheck, userApprovedModules)
  {
    var approved = false
    if (userApprovedModules.enabledModules.length > 0) //check there are modules in list, otherwise just return false
    {
      var foundIndex = userApprovedModules.enabledModules.findIndex(module => module.moduleID == moduleIDCheck)
      if(foundIndex != -1) //if equal to -1, means the specific module is not in the list and we can just return false
      {
        if(userApprovedModules.enabledModules[foundIndex].enabled)//check if module is currently enabled, otherwise return false
        {
          approved = true //set approved to true if all 3 conditions are met
        }
      }
    }
    return approved
  }


  // User logs in to the system
  async function logIn(data, socket) {
    // console.log("User attempted to log in");
    //Sanitise data to prevent No-sql injection
    data = deepSanitize(data);
    // Check email exists
    if (!data.email || !data.password) {
      logInFailed(socket, "Fields are empty", data);
      return;
    }

    // Check if account exists
    var databaseUser = await User.findOne({ email: data.email }).exec();
    if (databaseUser) {
      // Encrypt the password and check it against the pass word in the data base
      if (Bcrypt.compareSync(data.password, databaseUser.password)) {
        // User is now authenticated
        authenticated = true;
        setUserId(databaseUser._id, socket);
        // Send credentials and log in message
        socket.emit("logInResult", { result: true, doctor: databaseUser.doctor, forename: databaseUser.forename, surname: databaseUser.surname, message: "Success" });
      } else {
        // Send failure message
        logInFailed(socket, "Password incorrect", data);
      }
    } else {
      // Send failure message
      logInFailed(socket, "User does not exist", data);
    }
  }

  // Set the user id for the socket, so it can be referred to easily in the program
  function setUserId(id, socket) {
    userId = id;
    allSockets.push({ id: id, socket: socket });
  }

  // Error checking for the log in system
  function logInFailed(socket, message, data) {
    authenticated = false;
    socket.emit("logInResult", { result: false, doctor: false, message: message });
  }

  // Filter out unsafe JS code from the data sent from the client
  const deepSanitize = (value) => {
    if (Array.isArray(value)) {
      value.forEach(elm => deepSanitize(elm))
    }
    if (typeof (value) === 'object' && value !== null) {
      Object.values(value).forEach((elm) => {
        deepSanitize(elm)
      })
    }
    return sanitize(value)
  }
})

// Start the server on the port
server.listen(port, () => console.log(`Health App Server running at http://localhost:${port}`));

// Start sending out simulated finger prick data to subscribed users
setInterval(updateFingerPrickInfo, 10000);

// Add random finger prick info for subscribed users
async function updateFingerPrickInfo() {
  //console.log("Updating finger prick")
  //console.log(fingerPrickSubscribers);
  // Loop through the subscribers
  for (let id of fingerPrickSubscribers) {
    //console.log("User found")
    let approvedModuleList = await User.findOne({ _id: id} ,{_id: 0, enabledModules:1}).exec()
    //check blood sugard module is approved, only allow subscribing if it is approved
    if(checkIfApproved(3,approvedModuleList))
    {

      // Get the users that has been subscribed
      var user = await User.findOne({ _id: id }).exec();
      // Generate a random finger prick value
      user.fingerPrick.push({ millimolesPerLitre: getRndInteger(1, 10) });
      await user.save();

      // Emit real time data to subscribers
      for (let sub of userUpdateSubscribers) {
        if (stringEquals(user._id, sub.userId)) {
          //console.log("Emitting real time to " + sub.userId)
          sub.socket.emit("realTimeFingerPrickData", { fingerPrick: user.fingerPrick });
        }
      }

      //socketContainer = allSockets.find(soc => user._id.toString().localeCompare(soc.id.toString()) == 0);
      //if(socketContainer)
      //socketContainer.socket.emit("fingerPrickData", user.fingerPrick);
    }
  }
}

// Check if two strings in JS are equal
function stringEquals(a, b) {
  a = a.toString();
  b = b.toString();
  if (a.length !== b.length) {
    return false;
  }
  return a.localeCompare(b) === 0;
}

// Add socket to the list of users watching a patient recorc
function subscribeToUserUpdate(socket, id) {
  userUpdateSubscribers.push({ socket: socket, userId: id });
}

// Generate a random number
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}