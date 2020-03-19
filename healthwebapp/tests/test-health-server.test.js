var should = require('should')
var io = require('socket.io-client')
server = require('../../healthwebserver/server.js')
var socketURL = 'http://localhost:5000';


var options = {
  transports: ['websocket'],
  'force new connection': true
  //https://github.com/liamks/Testing-Socket.IO/blob/master/test/test-chat-server.js
  //http://liamkaufman.com/blog/2012/01/28/testing-socketio-with-mocha-should-and-socketio-client/
};

var newDoctortest = {
  email: 'rooleyzee123@gmail.com',
  password: 'Test',
  forename: 'Zak',
  surname: 'Rooley',
  doctor: true
};

var DrLogin = {
  email: 'rooleyzee123@gmail.com',
  password: 'Test'
}

var LoginWrongPass = {
  email: 'rooleyzee123@gmail.com',
  password: 'odiajsod'
}

var LoginNoUser = {
  email: 'rooleyz@gmail.com',
  password: 'askdnasldknas'
}
var LoginNopassword = {
  email: 'rooleyz@gmail.com',
  password: ''
}

var newPatienttest = {
  email: 'patient@gmail.com',
  password: 'Test',
  forename: 'Zak',
  surname: 'Rooley',
  doctor: false
};

var PatientLogin = {
  email: 'patient@gmail.com',
  password: 'Test',
}

var doctorId = '';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function stringEquals(a,b){
  a = a.toString();
  b = b.toString();
  if (a.length !== b.length) {
       return false;
  }
  return a.localeCompare(b) === 0;
}


describe("Web Health app Server", function () {

  let socket_1;
  beforeEach((done) => {
    socket_1 = io.connect(socketURL,
      { forceNew: true, query: '' });
    socket_1.on('connect', () => {
      done();
    });
  });

  afterEach((done) => {
    socket_1 && socket_1.connected && socket_1.disconnect();
    done();
  });

  //TEST connection test
  it('Connection to server', done => { if (socket_1.connected) { done();}});

  //TEST  make a new doctor account
  it('Make new doctor', done => {
    socket_1.on('logInResult', function (data) {
      if (data.message == "Success") { done(); }
    })
    socket_1.emit('signUp', newDoctortest);
  });

  //TEST Doctor Login
  it('Doctor Login', done => {
    socket_1.on('logInResult', function (data) {
      if (data.result) { done(); }
    })
    socket_1.emit('logIn', DrLogin);
  });


  //TEST  Login no password
  it('Login wrong password', done => {
    socket_1.on('logInResult', function (data) {
      if (data.message == "Password incorrect") { done(); }
    })
    socket_1.emit('logIn', LoginWrongPass);
  });

  //TEST  Login missing data
  it('Login missing data', done => {
    socket_1.on('logInResult', function (data) {
      if (data.message == "Fields are empty") { done(); }
    })
    socket_1.emit('logIn', LoginNopassword);
  });

  //TEST  Login no user
  it('Login no user', done => {
    socket_1.on('logInResult', function (data) {
      if (data.message == "User does not exist") { done(); }
    })
    socket_1.emit('logIn', LoginNoUser);
  });

  //TEST Make a new patient account
  it('Make new patient', done => {
    socket_1.on('logInResult', function (data) {
      if (data.message == "Success") { done(); }
    })
    socket_1.emit('signUp', newPatienttest);
  });

  // //TEST Add food 
  // it('Add food', done => {
  //   socket_1.on('logInResult', function (data) {
  //     var kitKat = {calories: 108, name:"KitKat", group:"Sugar"};
  //     var food = [kitKat];
  //     socket_1.emit("recordFoodDiary", food);
  //     done();
  //   });
  //   socket_1.emit('logIn', PatientLogin);
  // });

  // //TEST add exersise
  // it('add exersise', done => {
  //   socket_1.on('logInResult', function (data) {
  //     var cycling = {exercisetype: "High", exercisename:"Cycling"};
  //     socket_1.emit("recordExerciseDiary", [cycling]);
  //     done();
  //   });
  //   socket_1.emit('logIn', PatientLogin);
  // });


  // //TEST check blood sugar list
  // it('check blood sugar list', done => {
  //   socket_1.on("getMyPatientRecordResults", async function(data){
  //     if(data.bloodSugarReadings){
  //       done();
  //     }
  //   });

  //   socket_1.on('logInResult', async function (data) {
  //     socket_1.emit('getMyPatientRecord', {});
  //   });

  //   socket_1.emit('logIn', PatientLogin);
  // });

  // //TEST Get my doctor
  // it('Get my doctor', done => {
  //   var doctorId = "";
  //   socket_1.on('getAllDoctorsResults', async function (data){
  //     if(data.doctors.length > 0){
  //       doctorId = data.doctors[0]._id;
  //       socket_1.emit("updateAssignedDoctor", doctorId);
  //       await sleep(100);
  //       socket_1.emit("getMyDoctor", {});
  //     }
  //   });

  //   socket_1.on('getMyDoctorResults', async function (data){
  //     if(stringEquals(data.idAssignedDoctor, doctorId)){
  //       done();
  //     }
  //   });

  //   socket_1.on('logInResult', async function (data) {
  //     socket_1.emit('getAllDoctors', {});
  //   });

  //   socket_1.emit('logIn', PatientLogin);
  // });

  // //TEST check if subbed to finger prick, negative case
  // it('Check if finger prick subscribed', done => {
  //   socket_1.on('checkIfSubscribedResults', async function (data) {
  //     if (data.result) {
  //       socket_1.emit("unSubscribeFingerPrick", {});
  //       await sleep(100);
  //       done();
  //     }
  //   });
  //   socket_1.on('logInResult', async function (data) {
  //     socket_1.emit("subscribeToFingerPrick", {});
  //     await sleep(500);
  //     socket_1.emit('checkIfSubscribed', {});
  //   });
  //   socket_1.emit('logIn', DrLogin);
  // });

  // //TEST check if subbed to finger prick, negative case
  // it('Check if finger prick not subscribed', done => {
  //   socket_1.on('checkIfSubscribedResults', function (data) {
  //     if (!data.result) { done(); }
  //   });
  //   socket_1.on('logInResult', function (data) {
  //     socket_1.emit('checkIfSubscribed', {});
  //   });
  //   socket_1.emit('logIn', DrLogin);
  // });

  // //TEST list all doctors
  // it('List all doctors', done => {
  //   socket_1.on('getAllDoctorsResults', function (data) {
  //     if (data.doctors) { done(); }
  //   });
  //   socket_1.on('logInResult', function (data) {
  //     socket_1.emit('getAllDoctors', {});
  //   });
  //   socket_1.emit('logIn', DrLogin);
  // });

  // //TEST Real time finger prick updates
  // it('Real time finger prick updates for patient', done => {
  //   socket_1.on('getMyPatientRecordResults', function (data) {
  //     socket_1.emit("subscribeToFingerPrick", {});
  //   });

  //   socket_1.on("realTimeFingerPrickData", function (data){
  //     socket_1.emit("unsubPatientRecord", {});
  //     socket_1.emit("unSubscribeFingerPrick", {});
  //     done();
  //   });

  //   socket_1.on('logInResult', function (data) {
  //     socket_1.emit('getMyPatientRecord', {});
  //   });
  //   socket_1.emit('logIn', PatientLogin);
  // });

  // //TEST Real time food updates
  // it('Real time food updates for patient', done => {
  //   socket_1.on('getMyPatientRecordResults', function (data) {
  //     var kitKat = {calories: 108, name:"KitKat", group:"Sugar"};
  //     var food = [kitKat];
  //     socket_1.emit("recordFoodDiary", food);
  //   });

  //   socket_1.on("realTimeFood", function (data){
  //     done();
  //   });

  //   socket_1.on('logInResult', function (data) {
  //     socket_1.emit('getMyPatientRecord', {});
  //   });
  //   socket_1.emit('logIn', PatientLogin);
  // });

  // // TEST Real time exercise updates
  // it('Real time exercise updates for patient', done => {
  //   socket_1.on('getMyPatientRecordResults', function (data) {
  //     var cycling = {exercisetype: "High", exercisename:"Cycling"};
  //     socket_1.emit("recordExerciseDiary", [cycling]);
  //   });

  //   socket_1.on("realTimeExercise", function (data){
  //     done();
  //   });

  //   socket_1.on('logInResult', function (data) {
  //     socket_1.emit('getMyPatientRecord', {});
  //   });
  //   socket_1.emit('logIn', PatientLogin);
  // });

  
  /////////////////// Task 3 tests //////////////
  
  //TEST doctor send request
  it('Send request', done => {
    var patientId = "";
    socket_1.on('getAllPatientsResults', async function (data){
      if(data.patients.length > 0){
        patientId = data.patients[0]._id;
        socket_1.emit("sendDoctorRequest", patientId);
      }
    });
    
    socket_1.on('sendDoctorRequestResult', function(data)  {
      if (data == "Success!") { done(); }
    })
    
    socket_1.on('logInResult', async function (data) {
      socket_1.emit('getAllPatients', {});
    })
  socket_1.emit('logIn', DrLogin);
});

it('Cancel Request', done => {
  socket_1.emit('logIn', PatientLogin);
  socket_1.emit('cancelDoctorRequest', {});
  socket_1.on('cancelDoctorRequestResult', function(data)  {
    if (data == "Success!") { done(); }
  })
})

it('Accept request', done => {
  var patientId = "";
  socket_1.on('getAllPatientsResults', async function (data){
    if(data.patients.length > 0){
      patientId = data.patients[0]._id;
      socket_1.emit("sendDoctorRequest", patientId);
    }
  });
  
  socket_1.on('sendDoctorRequestResult', function(data)  {
    socket_1.emit('logIn', PatientLogin);
    socket_1.emit('acceptDoctorRequest', {});
    socket_1.on('acceptDoctorRequestResult', function(data)  {
      if (data == "Success!") { done(); }
    })
  })
  
  socket_1.on('logInResult', async function (data) {
    socket_1.emit('getAllPatients', {});
  })
socket_1.emit('logIn', DrLogin);
});





//TEST remove doctor account
it('Remove Doctor account', done => {
  socket_1.on('deleteAccountResults', function (data) {
    if (data == "Success") { done(); }
  })
  socket_1.emit('logIn', DrLogin);
  socket_1.on('logInResult', function (data) {
    socket_1.emit('deleteAccount', {});
  })
});

//TEST remove Patient account
it('Remove Patient account', done => {
  socket_1.on('deleteAccountResults', function (data) {
    if (data == "Success") { done(); }
  })
  socket_1.emit('logIn', PatientLogin);
  socket_1.on('logInResult', function (data) {
    socket_1.emit('deleteAccount', {});
  })
});
})
