var should = requre('should')
var io = require('socket.io-client')
server = require('../../healthwebserver/server.js')
var socketURL = 'http://localhost:5000';


var options ={

//https://github.com/liamks/Testing-Socket.IO/blob/master/test/test-chat-server.js
//http://liamkaufman.com/blog/2012/01/28/testing-socketio-with-mocha-should-and-socketio-client/
};

var newUsertest = {
    'forename': '',
    'surname': '',
    'email': '',
    'password': '',
    'doctor': '',
    'idAssignedDoctor':''
 };

describe("User able to create account",function(){
it('Should log in')


});