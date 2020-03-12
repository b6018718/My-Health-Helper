import React, {useState, useEffect} from 'react';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/header';
import Routes from './components/routes';
import { BrowserRouter } from "react-router-dom";
import socketIOClient from "socket.io-client";

import SocketContext from './components/socket';
/*
 These are the global variables for the
 application that can be carried across pages
 in the application.
*/

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

function setCurrentSelectedPatient(patientID)
{
  this.setState({currentSelectedPatient: patientID})
}

// Connect to the back end that is running on the PC on port 5000
const socket = socketIOClient("http://127.0.0.1:5000");

function App(props) {
  // Global variables
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isDoctor, userHasVerifiedDoctor ] = useState(false);
  const [registering, isRegistering] = useState(false);
  //const [patientAccountDetails, passUserAccount] = useState({firstname:"tmp1", lastname:"tmp2", email:"tmp3", password:"tmp"})
  const [nAccFirstName,passUserFirstName] = useState("")
  const [nAccLastName,passUserLastName] = useState("")
  const [nAccEmail,passUserEmail] = useState("")
  const [nAccPassword,passUserPassword] = useState("")
  const [currentSelectedPatient,setCurrentSelectedPatient] = useState("")
  
  //How to send data to the backend
  //socket.emit("log_in", {username: "Ant"});

  return (
    <div className="App site-container">
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <Header appProps={{ isAuthenticated, userHasAuthenticated, isDoctor, userHasVerifiedDoctor, registering, isRegistering,nAccFirstName,passUserFirstName,nAccLastName,passUserLastName,nAccEmail,passUserEmail,nAccPassword,passUserPassword,currentSelectedPatient,setCurrentSelectedPatient }} />
          <Routes appProps={{ isAuthenticated, userHasAuthenticated, isDoctor, userHasVerifiedDoctor, registering, isRegistering,nAccFirstName,passUserFirstName,nAccLastName,passUserLastName,nAccEmail,passUserEmail,nAccPassword,passUserPassword,currentSelectedPatient,setCurrentSelectedPatient}} />
        </BrowserRouter>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
