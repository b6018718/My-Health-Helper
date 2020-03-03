var should = require('should')
var io = require('socket.io-client')
server = require('../../healthwebserver/server.js')
var socketURL = 'http://localhost:5000';


var options ={
    transports: ['websocket'],
    'force new connection': true
//https://github.com/liamks/Testing-Socket.IO/blob/master/test/test-chat-server.js
//http://liamkaufman.com/blog/2012/01/28/testing-socketio-with-mocha-should-and-socketio-client/
};

var newUsertest = { 
email: 'rooleyzee123@gmail.com',
password: 'Test',
forename: 'Zak',
surname: 'Rooley',
doctor: true };

describe("Web Health app Server",function(){

let socket_1;
beforeEach((done) =>{
socket_1 = io.connect(socketURL,
{forceNew: true, query: ''});
socket_1.on ('connect',()=>{
done();
});
});

afterEach((done)=>
{
socket_1 && socket_1.connected && socket_1.disconnect();
done();
});

//TEST one
it('Connection to server', done => {
  if(socket_1.connected)
  {
    done();
  }
    
});

//TEST two
  it('Make new doctor',done =>
  {
  socket_1.emit('signUp',newUsertest);
  done();
  });

})

