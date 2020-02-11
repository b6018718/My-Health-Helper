import React, {useState, useEffect} from 'react';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/header';

import Routes from './components/routes';
import { BrowserRouter } from "react-router-dom";

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

  return (
    <div className="App">
      <BrowserRouter>
        <Header appProps={{ isAuthenticated, userHasAuthenticated, isDoctor, userHasVerifiedDoctor, registering, isRegistering }} />
        <Routes appProps={{ isAuthenticated, userHasAuthenticated, isDoctor, userHasVerifiedDoctor, registering, isRegistering }} />
      </BrowserRouter>
    </div>
  );
}

export default App;
