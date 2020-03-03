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


  //TEST one
  it('Connection to server', done => {
    if (socket_1.connected) {
      done();
    }

  });

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
  it('Login no password', done => {
    socket_1.on('logInResult', function (data) {

      if (data.message == "Password incorrect") { done(); }
    })
    socket_1.emit('logIn', LoginWrongPass);
  });

  //TEST  Login missing data
  it('Login no password', done => {
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

  //TEST remove doctor account
  it('Remove Doctor account', done => {
    socket_1.on('deleteAccountResults', function (data) {
      if (data = "success") { done(); }
    })
    socket_1.emit('logIn', DrLogin);
    socket_1.on('logInResult', function (data) {

      socket_1.emit('deleteAccount', {});
    })
    
  });
 //TEST Make a new patient account
 it('Make new patient', done => {
  socket_1.on('logInResult', function (data) {
    if (data.message == "Success") { done(); }
  })
  socket_1.emit('signUp', newPatienttest);

});


  //TEST remove patient account
  it('remove new patient', done => {
    socket_1.on('deleteAccountResults', function (data) {
      if (data = "success") { done(); }
    })
    socket_1.emit('logIn', PatientLogin);
    socket_1.on('logInResult', function (data) {

      socket_1.emit('deleteAccount', {});
    })
  });
 


  //TEST Add food 
  it('Make new patient', done => {
    socket_1.emit('signUp', newUsertest);
    done();
  });

  //TEST add exersise
  it('Make new patient', done => {
    socket_1.emit('signUp', newUsertest);
    done();
  });

  //TEST add to blood sugar list
  it('Make new patient', done => {
    socket_1.emit('signUp', newUsertest);
    done();
  });


  //TEST check blood sugar list
  it('Make new patient', done => {
    socket_1.emit('signUp', newUsertest);
    done();
  });


  //TEST Change assigned doctor
  it('Make new patient', done => {
    socket_1.emit('signUp', newUsertest);
    done();
  });


  //TEST Get my doctor
  it('Make new patient', done => {
    socket_1.emit('signUp', newUsertest);
    done();
  });

  //TEST check if subbed to finger prick
  it('Make new patient', done => {
    socket_1.emit('signUp', newUsertest);
    done();
  });

  //TEST list all doctors
  it('Make new patient', done => {
    socket_1.emit('signUp', newUsertest);
    done();
  });

})

