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

//Test One Connect to server Check
it('Connection to server', done => {
        const client = io(socketURL);
    
        client.on('connect', () => {
          client.close();
          done();
        });
    });
       
//Test Two Make new doctor
it('Should Make new doctor'),function(done)
{
var client = io.connect(socketURL,options)

client.on('connect',function(data)
{
client.emit('signUp',newUsertest);
done();
});
}
// Test Three Make a Patient
//it('Test Three Make a Patient'),


});

// Test Four