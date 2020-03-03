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

var DrLoginNoPass = {
  email: 'rooleyzee123@gmail.com',
  password: ''
}

var DrLoginPassincorrect = {
  email: 'rooleyzee123@gmail.com',
  password: ''
}

var newPatienttest = {
  email: 'rooleyzee123@gmail.com',
  password: 'Test',
  forename: 'Zak',
  surname: 'Rooley',
  doctor: true
};

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


  //TEST two make a new doctor account
  it('Make new doctor', done => {
    socket_1.on('logInResult', function (data) {
      if (data.message = "message: success") { done(); }
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

  //TEST remove patient account
  it('Make new patient', done => {
    socket_1.emit('signUp', newUsertest);
    done();
  });
  //TEST Make a new patient account
  it('Make new patient', done => {
    socket_1.emit('signUp', newUsertest);
    done();
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

