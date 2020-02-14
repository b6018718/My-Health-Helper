import React, {useState, useEffect} from 'react';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/header';

import Routes from './components/routes';
import { BrowserRouter } from "react-router-dom";
import socketIOClient from "socket.io-client";

function userHasVerifiedDoctor(bool){
  this.setState({ isDoctor: bool});
}

function isRegistering(bool){
  this.setState({ registering: bool });
}

function App(props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isDoctor, userHasVerifiedDoctor ] = useState(false);
  const [registering, isRegistering] = useState(false);
  const socket = socketIOClient("http://127.0.0.1:5000");

  //How to send data to the backend
  //socket.emit("log_in", {username: "Ant"});

  return (
    <div className="App">
      <BrowserRouter>
        <Header appProps={{ isAuthenticated, userHasAuthenticated, isDoctor, userHasVerifiedDoctor, registering, isRegistering, socket }} />
        <Routes appProps={{ isAuthenticated, userHasAuthenticated, isDoctor, userHasVerifiedDoctor, registering, isRegistering, socket }} />
      </BrowserRouter>
    </div>
  );
}

export default App;
