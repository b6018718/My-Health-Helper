import React, {useState, useEffect} from 'react';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/header';

import Routes from './components/routes';
import { BrowserRouter } from "react-router-dom";

function userHasVerifiedDoctor(doc){
  this.setState({ isDoctor: doc});
}

function App(props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isDoctor, userHasVerifiedDoctor ] = useState(false);

  useEffect(() => {
    //onLoad();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Header appProps={{ isAuthenticated, userHasAuthenticated, isDoctor, userHasVerifiedDoctor }}></Header>
        <Routes appProps={{ isAuthenticated, userHasAuthenticated, isDoctor, userHasVerifiedDoctor }} />
      </BrowserRouter>
    </div>
  );
}

export default App;
