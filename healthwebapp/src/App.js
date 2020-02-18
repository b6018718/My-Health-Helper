import React, {useState, useEffect} from 'react';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/header';
import Routes from './components/routes';
import { BrowserRouter } from "react-router-dom";
import socketIOClient from "socket.io-client";

import SocketContext from './components/socket';

function userHasVerifiedDoctor(bool){
  this.setState({ isDoctor: bool});
}

function isRegistering(bool){
  this.setState({ registering: bool });
}

function passUserFirstName(fname)
{
  this.setState({ nAccFirstName: fname});
}

function passUserLastName(lname)
{
this.setState({ nAccLastName: lname});
}

function passUserEmail(email)
{
this.setState({ nAccEmail: email});
}

function passUserPassword(password)
{
this.setState({ nAccPassword: password});
}

const socket = socketIOClient("http://127.0.0.1:5000");

function App(props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isDoctor, userHasVerifiedDoctor ] = useState(false);
  const [registering, isRegistering] = useState(false);
  //const [patientAccountDetails, passUserAccount] = useState({firstname:"tmp1", lastname:"tmp2", email:"tmp3", password:"tmp"})
  const [nAccFirstName,passUserFirstName] = useState("")
  const [nAccLastName,passUserLastName] = useState("")
  const [nAccEmail,passUserEmail] = useState("")
  const [nAccPassword,passUserPassword] = useState("")
  
  //How to send data to the backend
  //socket.emit("log_in", {username: "Ant"});

  return (
    <div className="App">
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <Header appProps={{ isAuthenticated, userHasAuthenticated, isDoctor, userHasVerifiedDoctor, registering, isRegistering,nAccFirstName,passUserFirstName,nAccLastName,passUserLastName,nAccEmail,passUserEmail,nAccPassword,passUserPassword }} />
          <Routes appProps={{ isAuthenticated, userHasAuthenticated, isDoctor, userHasVerifiedDoctor, registering, isRegistering,nAccFirstName,passUserFirstName,nAccLastName,passUserLastName,nAccEmail,passUserEmail,nAccPassword,passUserPassword}} />
        </BrowserRouter>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
